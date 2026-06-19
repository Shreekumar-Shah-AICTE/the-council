import asyncio
import json
import uuid
import sqlite3
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.config import BAND_AGENTS, verify_config
from backend.database.models import get_db_connection, init_db
from backend.engine.stakes_classifier import classify_decision
from backend.engine.convergence import calculate_convergence
from backend.engine.hash_chain import create_verdict_hash, create_dissent_hash
from backend.engine.dissent_logger import extract_dissent_from_verdict
from backend.integrations.llm_router import get_advisor_response
from backend.integrations.brightdata import fetch_salary_data
from backend.agents.prompts import (
    SKEPTIC_PROMPT,
    STRATEGIST_PROMPT,
    NUMBERS_PROMPT,
    DEVILS_PROMPT,
    CHAIR_PROMPT
)

app = FastAPI(title="THE COUNCIL API — Solo Hackathon DOMINATION")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
active_connections: dict[str, list[WebSocket]] = {}

class DecisionRequest(BaseModel):
    input_text: str

async def broadcast_to_decision(decision_id: str, data: dict):
    if decision_id in active_connections:
        disconnected = []
        for ws in active_connections[decision_id]:
            try:
                await ws.send_json(data)
            except Exception:
                disconnected.append(ws)
        for ws in disconnected:
            active_connections[decision_id].remove(ws)

# Band.ai REST helpers
BAND_BASE_URL = "https://app.band.ai/api/v1/agent"

async def band_create_room(name: str) -> str:
    """Create a chat room using the Chair's key and return the room ID."""
    chair_key = BAND_AGENTS["chair"]["key"]
    if not chair_key:
        print("Chair API Key not set. Skipping Band room creation.")
        return None
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{BAND_BASE_URL}/chats",
                headers={"X-API-Key": chair_key},
                json={"name": name}
            )
            if resp.status_code in [200, 201]:
                return resp.json().get("id")
    except Exception as e:
        print(f"Error creating Band room: {e}")
    return None

async def band_invite_peer(room_id: str, peer_id: str) -> bool:
    """Invite a peer to a room using the Chair's API key."""
    chair_key = BAND_AGENTS["chair"]["key"]
    if not chair_key or not room_id or not peer_id:
        return False
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{BAND_BASE_URL}/chats/{room_id}/participants",
                headers={"X-API-Key": chair_key},
                json={"agent_id": peer_id}
            )
            return resp.status_code in [200, 201]
    except Exception as e:
        print(f"Error inviting peer to Band room: {e}")
    return False

async def band_send_message(room_id: str, agent_role: str, content: str) -> bool:
    """Send a message to a room as a specific agent using their API key."""
    agent_key = BAND_AGENTS[agent_role]["key"]
    if not agent_key or not room_id:
        return False
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            # We mention the other participants or just post text
            resp = await client.post(
                f"{BAND_BASE_URL}/chats/{room_id}/messages",
                headers={"X-API-Key": agent_key},
                json={"content": content}
            )
            return resp.status_code in [200, 201]
    except Exception as e:
        print(f"Error sending message as {agent_role}: {e}")
    return False


async def orchestrate_debate(decision_id: str, input_text: str, category: str, stakes_level: int, evidence: dict = None):
    try:
        # Step 1: Update status to debating
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE decisions SET status = 'debating' WHERE id = ?", (decision_id,))
        conn.commit()
        
        # Step 2: Create Band room if keys are present
        band_room_id = await band_create_room(f"The Council Chamber — Decision {decision_id[:6]}")
        if band_room_id:
            cursor.execute("UPDATE decisions SET band_room_id = ? WHERE id = ?", (band_room_id, decision_id))
            conn.commit()
            
            # Invite other members to the room
            for role, cfg in BAND_AGENTS.items():
                if role != "chair" and cfg["id"]:
                    await band_invite_peer(band_room_id, cfg["id"])
            
            # Post initial message
            await band_send_message(
                band_room_id, 
                "chair", 
                f"@Skeptic @Strategist @Numbers @DevilsAdvocate The Council is convened to debate: \"{input_text}\". Let us begin."
            )
            
        await broadcast_to_decision(decision_id, {"type": "status", "status": "debating", "band_room_id": band_room_id})
        await asyncio.sleep(1)  # Brief pause for UI pacing
        
        # --- Round 1: Initial Positions ---
        round_1_args = {}
        
        # 1. The Skeptic
        await broadcast_to_decision(decision_id, {"type": "typing", "advisor": "skeptic"})
        skeptic_text = await get_advisor_response("skeptic", SKEPTIC_PROMPT, f"The user is facing this decision: {input_text}")
        round_1_args["skeptic"] = skeptic_text
        cursor.execute(
            "INSERT INTO arguments (decision_id, advisor_id, content, position, round) VALUES (?, ?, ?, ?, ?)",
            (decision_id, "skeptic", skeptic_text, "against", 1)
        )
        conn.commit()
        if band_room_id:
            await band_send_message(band_room_id, "skeptic", f"@Chair @Strategist @Numbers @DevilsAdvocate Here is my skeptical warning: {skeptic_text}")
        await broadcast_to_decision(decision_id, {"type": "argument", "advisor": "skeptic", "content": skeptic_text, "round": 1})
        await asyncio.sleep(1.5)
        
        # 2. The Strategist
        await broadcast_to_decision(decision_id, {"type": "typing", "advisor": "strategist"})
        strategist_text = await get_advisor_response("strategist", STRATEGIST_PROMPT, f"The user is facing this decision: {input_text}")
        round_1_args["strategist"] = strategist_text
        cursor.execute(
            "INSERT INTO arguments (decision_id, advisor_id, content, position, round) VALUES (?, ?, ?, ?, ?)",
            (decision_id, "strategist", strategist_text, "for", 1)
        )
        conn.commit()
        if band_room_id:
            await band_send_message(band_room_id, "strategist", f"@Chair @Skeptic @Numbers @DevilsAdvocate Here is my strategic vision: {strategist_text}")
        await broadcast_to_decision(decision_id, {"type": "argument", "advisor": "strategist", "content": strategist_text, "round": 1})
        await asyncio.sleep(1.5)
        
        # 3. The Numbers (Grounding with Brightdata evidence)
        await broadcast_to_decision(decision_id, {"type": "typing", "advisor": "numbers"})
        numbers_prompt_input = f"The user is facing this decision: {input_text}."
        if evidence:
            numbers_prompt_input += f"\nBrightdata salary scrape / market evidence: {json.dumps(evidence)}"
        numbers_text = await get_advisor_response("numbers", NUMBERS_PROMPT, numbers_prompt_input)
        round_1_args["numbers"] = numbers_text
        cursor.execute(
            "INSERT INTO arguments (decision_id, advisor_id, content, position, round) VALUES (?, ?, ?, ?, ?)",
            (decision_id, "numbers", numbers_text, "data", 1)
        )
        conn.commit()
        if band_room_id:
            await band_send_message(band_room_id, "numbers", f"@Chair @Skeptic @Strategist @DevilsAdvocate Here are the numbers: {numbers_text}")
        await broadcast_to_decision(decision_id, {"type": "argument", "advisor": "numbers", "content": numbers_text, "round": 1})
        await asyncio.sleep(1.5)
        
        # --- Round 2: Challenge (The Devil's Advocate) ---
        await broadcast_to_decision(decision_id, {"type": "typing", "advisor": "devils_advocate"})
        devils_input = (
            f"The user decision is: {input_text}\n\n"
            f"The other advisors have stated the following:\n"
            f"SKEPTIC: {skeptic_text}\n\n"
            f"STRATEGIST: {strategist_text}\n\n"
            f"NUMBERS: {numbers_text}\n\n"
            f"Challenge the emerging consensus. Push them to defend their points."
        )
        devils_text = await get_advisor_response("devils_advocate", DEVILS_PROMPT, devils_input)
        cursor.execute(
            "INSERT INTO arguments (decision_id, advisor_id, content, position, round) VALUES (?, ?, ?, ?, ?)",
            (decision_id, "devils_advocate", devils_text, "challenge", 2)
        )
        conn.commit()
        if band_room_id:
            await band_send_message(band_room_id, "devils_advocate", f"@Chair @Skeptic @Strategist @Numbers Here is my challenge: {devils_text}")
        await broadcast_to_decision(decision_id, {"type": "argument", "advisor": "devils_advocate", "content": devils_text, "round": 2})
        await asyncio.sleep(2.0)
        
        # --- Round 3: Verdict (The Chair) ---
        await broadcast_to_decision(decision_id, {"type": "typing", "advisor": "chair"})
        chair_input = (
            f"The user decision is: {input_text}\n\n"
            f"Review the entire debate and deliver the final verdict:\n"
            f"SKEPTIC: {skeptic_text}\n\n"
            f"STRATEGIST: {strategist_text}\n\n"
            f"NUMBERS: {numbers_text}\n\n"
            f"DEVIL'S ADVOCATE: {devils_text}\n\n"
            f"Acknowledge each by name, state a clear recommendation, highlight the dissent, and list the next 3 actions."
        )
        chair_text = await get_advisor_response("chair", CHAIR_PROMPT, chair_input)
        
        # Extract verdict details
        recommendation = "Accept the offer"
        reasoning = chair_text
        dissent_text = "The Devil's Advocate raised points we cannot dismiss."
        action_items = ["Action 1", "Action 2", "Action 3"]
        
        # Parsing Chair's output structure
        try:
            if "THE VERDICT" in chair_text:
                parts = chair_text.split("THE VERDICT")
                verdict_body = parts[1].strip()
                
                # Split reasoning, dissent, steps
                rec_part = verdict_body.split("The Reasoning:")[0].replace("**", "").replace("---", "").strip()
                recommendation = rec_part if rec_part else recommendation
                
                reasoning_part = verdict_body.split("The Reasoning:")[1].split("The Dissent:")[0].strip()
                reasoning = reasoning_part if reasoning_part else reasoning
                
                dissent_part = verdict_body.split("The Dissent:")[1].split("Your Next 3 Steps:")[0].strip()
                dissent_text = dissent_part if dissent_part else dissent_text
                
                steps_part = verdict_body.split("Your Next 3 Steps:")[1].strip()
                # Parse steps list
                lines = [line.strip() for line in steps_part.split("\n") if line.strip()]
                parsed_steps = []
                for line in lines:
                    if line.startswith(("1.", "2.", "3.", "-", "*")):
                        parsed_steps.append(re.sub(r'^[123\.\-\*\s]+', '', line).strip())
                if parsed_steps:
                    action_items = parsed_steps[:3]
        except Exception as e:
            print(f"Error parsing Chair's text: {e}")
            
        # Convergence and hashing
        args_list = [
            {"position": "against", "content": skeptic_text},
            {"position": "for", "content": strategist_text},
            {"position": "data", "content": numbers_text},
            {"position": "challenge", "content": devils_text}
        ]
        convergence_score = calculate_convergence(args_list)
        
        # Cryptographic link chain
        cursor.execute("SELECT hash FROM verdicts ORDER BY created_at DESC LIMIT 1")
        row = cursor.fetchone()
        prev_hash = row[0] if row else "GENESIS"
        
        verdict_id = str(uuid.uuid4().hex)
        verdict_hash = create_verdict_hash(chair_text, prev_hash)
        
        cursor.execute(
            """INSERT INTO verdicts (id, decision_id, recommendation, reasoning, confidence, action_items, convergence_score, hash, prev_hash) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (verdict_id, decision_id, recommendation, reasoning, "high", json.dumps(action_items), convergence_score, verdict_hash, prev_hash)
        )
        
        # Dissent logger
        dissent_info = extract_dissent_from_verdict(chair_text, args_list)
        dissent_advisor = dissent_info["advisor_role"] if dissent_info else "devils_advocate"
        dissent_content = dissent_info["dissent_content"] if dissent_info else dissent_text
        
        dissent_hash = create_dissent_hash(dissent_content, verdict_hash)
        cursor.execute(
            "INSERT INTO dissents (verdict_id, advisor_id, dissent_content, hash) VALUES (?, ?, ?, ?)",
            (verdict_id, dissent_advisor, dissent_content, dissent_hash)
        )
        
        # Final status update
        cursor.execute("UPDATE decisions SET status = 'concluded', concluded_at = ? WHERE id = ?", (datetime.utcnow().isoformat(), decision_id))
        conn.commit()
        
        if band_room_id:
            await band_send_message(band_room_id, "chair", f"@Skeptic @Strategist @Numbers @DevilsAdvocate The debate is concluded. Here is my final verdict:\n\n{chair_text}")
            
        # Broadcast final result
        await broadcast_to_decision(decision_id, {
            "type": "verdict",
            "verdict_id": verdict_id,
            "recommendation": recommendation,
            "reasoning": reasoning,
            "dissent": dissent_content,
            "dissent_advisor": dissent_advisor,
            "action_items": action_items,
            "convergence_score": convergence_score,
            "hash": verdict_hash,
            "prev_hash": prev_hash
        })
        
    except Exception as e:
        print(f"Error orchestrating debate: {e}")
        import traceback
        traceback.print_exc()
        await broadcast_to_decision(decision_id, {"type": "error", "message": str(e)})
    finally:
        conn.close()

import re

@app.post("/api/decisions")
async def create_decision(req: DecisionRequest, background_tasks: BackgroundTasks):
    try:
        # 1. Stakes classification
        classification = classify_decision(req.input_text)
        
        # 2. Brightdata evidence scrape (run synchronously here or mock check)
        evidence_data = None
        if classification["category"] in ["career", "financial"]:
            # Parse simple job title from text
            match = re.search(r'(?:engineer|manager|developer|designer|analyst|pm|pm| PM)', req.input_text, re.IGNORECASE)
            job = match.group(0) if match else "Software Engineer"
            evidence_data = await fetch_salary_data(job)
            
        decision_id = str(uuid.uuid4().hex)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO decisions (id, input_text, category, stakes_level, stakes_factors, status) VALUES (?, ?, ?, ?, ?, ?)",
            (decision_id, req.input_text, classification["category"], classification["stakes_level"], json.dumps(classification["factors"]), "pending")
        )
        
        if evidence_data:
            cursor.execute(
                "INSERT INTO evidence (decision_id, source, data_type, content) VALUES (?, ?, ?, ?)",
                (decision_id, evidence_data.get("source", "market_benchmark"), "salary_data", json.dumps(evidence_data))
            )
            
        conn.commit()
        conn.close()
        
        # Trigger background orchestration task
        background_tasks.add_task(
            orchestrate_debate, 
            decision_id, 
            req.input_text, 
            classification["category"], 
            classification["stakes_level"], 
            evidence_data
        )
        
        return {
            "decision_id": decision_id,
            "category": classification["category"],
            "stakes_level": classification["stakes_level"],
            "factors": classification["factors"],
            "has_evidence": evidence_data is not None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/decisions/{decision_id}")
async def get_decision(decision_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get decision
    cursor.execute("SELECT * FROM decisions WHERE id = ?", (decision_id,))
    decision = cursor.fetchone()
    if not decision:
        conn.close()
        raise HTTPException(status_code=404, detail="Decision not found")
        
    decision_dict = dict(decision)
    
    # Get arguments
    cursor.execute("SELECT * FROM arguments WHERE decision_id = ? ORDER BY round ASC, created_at ASC", (decision_id,))
    arguments = [dict(arg) for arg in cursor.fetchall()]
    decision_dict["arguments"] = arguments
    
    # Get verdict
    cursor.execute("SELECT * FROM verdicts WHERE decision_id = ?", (decision_id,))
    verdict = cursor.fetchone()
    if verdict:
        verdict_dict = dict(verdict)
        verdict_dict["action_items"] = json.loads(verdict_dict["action_items"]) if verdict_dict["action_items"] else []
        
        # Get dissent
        cursor.execute("SELECT * FROM dissents WHERE verdict_id = ?", (verdict_dict["id"],))
        dissent = cursor.fetchone()
        verdict_dict["dissent"] = dict(dissent) if dissent else None
        
        decision_dict["verdict"] = verdict_dict
    else:
        decision_dict["verdict"] = None
        
    # Get evidence
    cursor.execute("SELECT * FROM evidence WHERE decision_id = ?", (decision_id,))
    evidence = [dict(ev) for ev in cursor.fetchall()]
    decision_dict["evidence"] = evidence
    
    conn.close()
    return decision_dict

@app.get("/api/decisions")
async def list_decisions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM decisions ORDER BY created_at DESC")
    decisions = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return decisions

@app.websocket("/ws/debate/{decision_id}")
async def debate_stream(websocket: WebSocket, decision_id: str):
    await websocket.accept()
    if decision_id not in active_connections:
        active_connections[decision_id] = []
    active_connections[decision_id].append(websocket)
    
    # On connect, send current state if exists
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM decisions WHERE id = ?", (decision_id,))
        decision = cursor.fetchone()
        
        if decision:
            # Send current arguments
            cursor.execute("SELECT * FROM arguments WHERE decision_id = ? ORDER BY round ASC, created_at ASC", (decision_id,))
            for arg in cursor.fetchall():
                await websocket.send_json({
                    "type": "argument",
                    "advisor": arg["advisor_id"],
                    "content": arg["content"],
                    "round": arg["round"]
                })
                
            # Send verdict if exists
            cursor.execute("SELECT * FROM verdicts WHERE decision_id = ?", (decision_id,))
            verdict = cursor.fetchone()
            if verdict:
                cursor.execute("SELECT * FROM dissents WHERE verdict_id = ?", (verdict["id"],))
                dissent = cursor.fetchone()
                
                await websocket.send_json({
                    "type": "verdict",
                    "verdict_id": verdict["id"],
                    "recommendation": verdict["recommendation"],
                    "reasoning": verdict["reasoning"],
                    "dissent": dissent["dissent_content"] if dissent else "",
                    "dissent_advisor": dissent["advisor_id"] if dissent else "devils_advocate",
                    "action_items": json.loads(verdict["action_items"]) if verdict["action_items"] else [],
                    "convergence_score": verdict["convergence_score"],
                    "hash": verdict["hash"],
                    "prev_hash": verdict["prev_hash"]
                })
        conn.close()
    except Exception as e:
        print(f"Error on WS connect rehydration: {e}")
        
    try:
        while True:
            # Keep connection open, listen for ping/close
            data = await websocket.receive_text()
            # If client wants to send something, handle it here
    except WebSocketDisconnect:
        if decision_id in active_connections:
            active_connections[decision_id].remove(websocket)

@app.on_event("startup")
def startup_event():
    # Verify setup and create DB
    init_db()
    verify_config()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
