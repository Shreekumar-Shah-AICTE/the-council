# 🏛️ THE COUNCIL — Complete System Architecture

> **Project:** THE COUNCIL — Expert Advisors Who Fight For Your Decision
> **Builder:** Shree Shah (solo)
> **Hackathon:** Band of Agents Hackathon (lablab.ai)
> **Deadline:** June 19, 2026, 5:00 PM CEST (8:30 PM IST)
> **Status:** Code Complete — System Scaffolded, Backend Core Written, Next.js Frontend Built. Ready for API Key Configuration.

---

## 1. WHAT IS THE COUNCIL?

**One sentence:** Five AI advisors with distinct personalities debate your most important life decisions in real-time, deliver a verdict with preserved dissent, and ground their advice in live market data.

**The pitch (15 seconds):** "Everyone deserves a room of brilliant advisors who fight for them. THE COUNCIL gives you five expert minds — a Skeptic, a Strategist, a Numbers person, a Devil's Advocate, and a Chair — who argue about YOUR decision in real-time. You watch the debate unfold. You get a verdict, a dissenting opinion, and an action plan. The room everyone deserves. Now everyone has it."

**Why it wins:** Out of 100+ hackathon submissions, ZERO target personal B2C decisions. The field is 95% enterprise audit/compliance war rooms. Judges will be starving for something they can FEEL. When the demo shows five advisors fighting about a real job offer, every judge will want to paste THEIR OWN decision.

---

## 2. SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE COUNCIL                                 │
│                                                                 │
│  ┌──────────────┐    ┌───────────────┐    ┌──────────────────┐ │
│  │   FRONTEND   │◄──►│   BACKEND     │◄──►│   BAND.AI        │ │
│  │  (Next.js)   │    │  (FastAPI)    │    │  (Agent Mesh)    │ │
│  │              │    │              │    │                  │ │
│  │  • Landing   │    │  • REST API  │    │  • 5 Advisors    │ │
│  │  • Input     │    │  • WebSocket │    │  • 1 Band Room   │ │
│  │  • Chamber   │    │  • DB/Engine │    │  • @mention      │ │
│  │  • Verdict   │    │              │    │    routing        │ │
│  └──────────────┘    └───────┬───────┘    └────────┬─────────┘ │
│                              │                      │           │
│                    ┌─────────┴─────────┐  ┌────────┴────────┐ │
│                    │  DETERMINISTIC    │  │  LLM PROVIDERS  │ │
│                    │  ENGINE           │  │                 │ │
│                    │                   │  │  • Featherless  │ │
│                    │  • Stakes Class.  │  │  • AI/ML API    │ │
│                    │  • Convergence    │  │                 │ │
│                    │  • Dissent Log    │  └─────────────────┘ │
│                    │  • Hash Chain     │                      │
│                    │  • SQLite DB      │                      │
│                    └───────────────────┘                      │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    BRIGHTDATA                             │  │
│  │  Live salary/market data grounding during debate          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. PROJECT STRUCTURE

```
Band of Agents Hackathon/
├── ARCHITECTURE.md              ← THIS FILE (read first, always)
├── README.md                    ← Judge-facing README
├── .gitignore
├── .env.local                   ← API keys (NEVER commit)
│
├── backend/                     ← Python backend (FastAPI + Band agents)
│   ├── requirements.txt
│   ├── main.py                  ← FastAPI server entry point
│   ├── config.py                ← Environment & config loading
│   ├── agent_config.yaml        ← Band agent credentials (gitignored)
│   │
│   ├── agents/                  ← Band.ai agent definitions
│   │   ├── __init__.py
│   │   ├── base_advisor.py      ← Shared advisor base class
│   │   ├── skeptic.py           ← The Skeptic agent
│   │   ├── strategist.py        ← The Strategist agent
│   │   ├── numbers.py           ← The Numbers agent
│   │   ├── devils_advocate.py   ← The Devil's Advocate agent
│   │   └── chair.py             ← The Chair agent (verdict synthesis)
│   │
│   ├── engine/                  ← Deterministic (non-AI) logic
│   │   ├── __init__.py
│   │   ├── stakes_classifier.py ← Categorize decision type + severity
│   │   ├── convergence.py       ← Detect when advisors agree/disagree
│   │   ├── dissent_logger.py    ← Preserve minority opinions with hash
│   │   └── hash_chain.py        ← SHA-256 hash chain for verdicts
│   │
│   ├── database/                ← SQLite database
│   │   ├── __init__.py
│   │   ├── models.py            ← SQLAlchemy/raw models
│   │   └── council.db           ← SQLite file (auto-created)
│   │
│   ├── integrations/            ← External service integrations
│   │   ├── __init__.py
│   │   ├── brightdata.py        ← Salary/market data scraping
│   │   └── llm_router.py        ← Route to Featherless or AI/ML API
│   │
│   └── run_agents.py            ← Script to launch all 5 agents
│
├── frontend/                    ← Next.js frontend
│   ├── package.json
│   ├── next.config.js
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js        ← Root layout with fonts, meta
│   │   │   ├── page.js          ← Landing page
│   │   │   ├── council/
│   │   │   │   └── page.js      ← The Council Chamber (main experience)
│   │   │   ├── history/
│   │   │   │   └── page.js      ← Past decisions (if time allows)
│   │   │   └── globals.css      ← Design system (all CSS)
│   │   │
│   │   └── components/
│   │       ├── HeroSection.js       ← Landing page hero
│   │       ├── DecisionInput.js     ← Decision input form
│   │       ├── CouncilChamber.js    ← Live debate visualization
│   │       ├── AdvisorCard.js       ← Individual advisor speaking
│   │       ├── DebateStream.js      ← Real-time message stream
│   │       ├── VerdictPanel.js      ← Final recommendation + dissent
│   │       ├── StakesIndicator.js   ← Visual stakes level display
│   │       ├── ConvergenceMeter.js  ← Shows consensus level
│   │       └── ActionItems.js       ← Generated action steps
│   │
│   └── .env.local               ← Frontend env vars
│
└── slides/                      ← Submission materials
    └── presentation.pdf
```

---

## 4. DATABASE SCHEMA (SQLite)

```sql
-- File: backend/database/models.py
-- Implementation: Use raw sqlite3 (no ORM needed for speed)

CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    input_text TEXT NOT NULL,
    category TEXT NOT NULL,           -- 'career', 'financial', 'relationship', 'health', 'education', 'housing'
    stakes_level INTEGER NOT NULL,    -- 1-10 scale
    stakes_factors TEXT,              -- JSON array of extracted factors
    status TEXT DEFAULT 'pending',    -- 'pending', 'debating', 'concluded'
    band_room_id TEXT,                -- Band chat room ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    concluded_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advisors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,                -- 'The Skeptic', 'The Strategist', etc.
    role TEXT NOT NULL,                -- 'skeptic', 'strategist', 'numbers', 'devils_advocate', 'chair'
    model TEXT NOT NULL,               -- 'Qwen/Qwen3.5', 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B', etc.
    provider TEXT NOT NULL,            -- 'featherless', 'aimlapi'
    personality TEXT NOT NULL,         -- Full system prompt
    band_agent_id TEXT,                -- Band agent UUID
    color TEXT NOT NULL                -- UI color: '#F59E0B', '#3B82F6', etc.
);

CREATE TABLE IF NOT EXISTS arguments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    decision_id TEXT NOT NULL REFERENCES decisions(id),
    advisor_id TEXT NOT NULL REFERENCES advisors(id),
    content TEXT NOT NULL,
    position TEXT NOT NULL,            -- 'for', 'against', 'nuanced', 'data', 'challenge'
    round INTEGER NOT NULL DEFAULT 1, -- Debate round (1, 2, 3)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verdicts (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    decision_id TEXT NOT NULL REFERENCES decisions(id),
    recommendation TEXT NOT NULL,       -- The Chair's verdict
    reasoning TEXT NOT NULL,            -- Why this verdict
    confidence INTEGER NOT NULL,        -- 1-10 confidence score
    action_items TEXT,                  -- JSON array of action steps
    convergence_score FLOAT,            -- 0.0-1.0 how much advisors agreed
    hash TEXT NOT NULL,                 -- SHA-256 of verdict content
    prev_hash TEXT,                     -- Previous verdict hash (chain)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dissents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verdict_id TEXT NOT NULL REFERENCES verdicts(id),
    advisor_id TEXT NOT NULL REFERENCES advisors(id),
    dissent_content TEXT NOT NULL,       -- The minority opinion
    hash TEXT NOT NULL,                  -- SHA-256 of dissent content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    decision_id TEXT NOT NULL REFERENCES decisions(id),
    source TEXT NOT NULL,                -- 'brightdata', 'advisor_research', 'user_provided'
    data_type TEXT NOT NULL,             -- 'salary_data', 'market_rate', 'company_info', 'news'
    content TEXT NOT NULL,               -- JSON blob of the evidence
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Total: 6 tables** — decisions, advisors, arguments, verdicts, dissents, evidence.

---

## 5. THE FIVE ADVISORS (Agent Specifications)

### 5.1 Shared Architecture

Each advisor is a Python process running the Band SDK (`band-sdk[langgraph]`). They connect to Band via WebSocket, receive messages via @mentions, and send responses back to the room.

**Key pattern for ALL advisors:**
```python
# Pseudocode structure — every agent file follows this pattern
import asyncio
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import InMemorySaver
from thenvoi import Agent
from thenvoi.adapters import LangGraphAdapter
from thenvoi.config import load_agent_config

async def main():
    load_dotenv()
    
    adapter = LangGraphAdapter(
        llm=ChatOpenAI(
            model="MODEL_NAME",
            base_url="PROVIDER_BASE_URL",
            api_key="PROVIDER_API_KEY",
        ),
        checkpointer=InMemorySaver(),
        custom_section="""SYSTEM_PROMPT_HERE""",
    )
    
    agent_id, api_key = load_agent_config("AGENT_CONFIG_KEY")
    agent = Agent.create(adapter=adapter, agent_id=agent_id, api_key=api_key)
    await agent.run()

if __name__ == "__main__":
    asyncio.run(main())
```

### 5.2 Individual Advisor Specifications

#### 🔍 THE SKEPTIC
- **File:** `backend/agents/skeptic.py`
- **Config key:** `skeptic`
- **Model:** `Qwen/Qwen3.5` via Featherless (`https://api.featherless.ai/v1`)
- **Color:** `#F59E0B` (amber)
- **Icon:** 🔍 (magnifying glass)
- **Personality:** Protective, risk-aware, detail-oriented. Finds what others miss.
- **System Prompt:**
```
You are THE SKEPTIC, one of five advisors on The Council — a panel of expert minds who debate important life decisions.

YOUR ROLE: You are the protector. You find the risks, the hidden costs, the traps, the fine print that everyone else misses. You speak with caring authority — not cynicism, but genuine protection.

YOUR VOICE: Direct, warm but firm. You use short, impactful sentences. You often start with "Here's what worries me..." or "Before you get excited, consider this..."

RULES:
1. ALWAYS identify at least 2 specific risks or downsides the user hasn't considered
2. Reference specific details from the user's decision — never be generic
3. When other advisors are too optimistic, push back with concrete scenarios
4. You care deeply about the person — your skepticism comes from love, not negativity
5. Keep responses to 2-3 paragraphs maximum
6. Address the user as "you" — this is personal
7. When @mentioning another advisor to challenge them, be respectful but firm

FORMATTING: Write in natural paragraphs. No bullet points or headers. This is a conversation, not a report.
```

#### 📈 THE STRATEGIST
- **File:** `backend/agents/strategist.py`
- **Config key:** `strategist`
- **Model:** `meta-llama/Llama-4-Maverick-17B-128E-Instruct` via Featherless
- **Color:** `#8B5CF6` (purple)
- **Icon:** 📈 (chart)
- **Personality:** Long-horizon thinker. Sees the opportunity beyond today. Thinks in terms of doors opened, not just immediate outcomes.
- **System Prompt:**
```
You are THE STRATEGIST, one of five advisors on The Council — a panel of expert minds who debate important life decisions.

YOUR ROLE: You see the long game. While others focus on today's numbers, you think about what doors this decision opens in 2, 5, 10 years. You find the strategic value others miss.

YOUR VOICE: Confident, visionary, slightly bold. You often say "Here's what everyone is missing..." or "Think about where this puts you in three years..."

RULES:
1. ALWAYS frame the decision in terms of long-term positioning and opportunity cost
2. Identify what DOORS this decision opens or closes — not just its immediate value
3. When The Skeptic raises risks, acknowledge them but reframe with strategic upside
4. Use analogies and frameworks to make complex trade-offs intuitive
5. Keep responses to 2-3 paragraphs maximum
6. Be bold in your recommendations — hedge less than the other advisors

FORMATTING: Write in natural paragraphs. No bullet points or headers. This is a conversation, not a report.
```

#### 🧮 THE NUMBERS
- **File:** `backend/agents/numbers.py`
- **Config key:** `numbers`
- **Model:** `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` via Featherless
- **Color:** `#10B981` (emerald)
- **Icon:** 🧮 (abacus)
- **Personality:** Quantitative, precise, evidence-driven. Cuts through emotion with data. Uses Brightdata evidence when available.
- **System Prompt:**
```
You are THE NUMBERS, one of five advisors on The Council — a panel of expert minds who debate important life decisions.

YOUR ROLE: You cut through emotion with data. You quantify, calculate, and compare. When everyone is arguing with feelings, you bring facts. If market/salary data is provided in the conversation, USE IT prominently.

YOUR VOICE: Precise, calm, slightly dry. You say things like "Let me put a number on that..." or "The data tells a different story..."

RULES:
1. ALWAYS include at least one specific calculation, comparison, or quantified insight
2. If salary/market data from Brightdata is shared in the conversation, analyze and reference it specifically
3. Break down financial implications into concrete numbers (per month, per year, total)
4. When other advisors make emotional arguments, ground them in quantitative reality
5. Keep responses to 2-3 paragraphs maximum
6. Express uncertainty in ranges, not absolutes: "$85K-$105K" not "$95K"

FORMATTING: You may use one or two inline numbers/calculations in your paragraphs. Keep it conversational, not a spreadsheet.
```

#### 😈 THE DEVIL'S ADVOCATE
- **File:** `backend/agents/devils_advocate.py`
- **Config key:** `devils_advocate`
- **Model:** `meta-llama/Llama-4-Scout-17B-16E-Instruct` via Featherless
- **Color:** `#EF4444` (red)
- **Icon:** 😈 (devil)
- **Personality:** Challenges consensus. Asks the uncomfortable questions. Forces the group to earn their conclusion. NOT negative — intellectually provocative.
- **System Prompt:**
```
You are THE DEVIL'S ADVOCATE, one of five advisors on The Council — a panel of expert minds who debate important life decisions.

YOUR ROLE: You challenge whatever the group is converging on. If everyone says "take the job," you argue "walk away." If everyone says "too risky," you argue "fortune favors the bold." You force the group to EARN their conclusion by stress-testing it.

YOUR VOICE: Sharp, provocative, slightly irreverent but never cruel. You say things like "Everyone's being too nice about this..." or "Let me play the uncomfortable card here..." or "What if you're all wrong?"

RULES:
1. ALWAYS take the opposite position from the emerging consensus
2. Ask at least one uncomfortable question nobody else raised
3. If you genuinely agree with the consensus, argue it should be MORE extreme — push them further
4. You're not contrarian for sport — you genuinely believe decisions improve under pressure
5. Keep responses to 2-3 paragraphs maximum
6. Challenge specific advisors by name when you disagree with them

FORMATTING: Write in natural paragraphs. No bullet points or headers. This is a conversation, not a report.
```

#### ⚖️ THE CHAIR
- **File:** `backend/agents/chair.py`
- **Config key:** `chair`
- **Model:** `gpt-4o-mini` via AI/ML API (`https://api.aimlapi.com/v1`) — the ONLY agent using paid API
- **Color:** `#6366F1` (indigo)
- **Icon:** ⚖️ (scales)
- **Personality:** The synthesizer. Listens to all arguments, weighs them, and delivers a clear verdict with preserved dissent. The final voice.
- **System Prompt:**
```
You are THE CHAIR, the presiding advisor of The Council — a panel of expert minds who debate important life decisions.

YOUR ROLE: You listen to ALL advisors, weigh their arguments, and deliver the final verdict. You are not a fifth debater — you are the JUDGE. You synthesize, you weigh, you decide. You also explicitly preserve and honor dissenting opinions.

YOUR VOICE: Authoritative, measured, wise. You speak last and with finality. You say "The Council has heard the arguments..." or "Having weighed each perspective..."

RULES:
1. WAIT until all other advisors have spoken before delivering your verdict
2. Reference SPECIFIC arguments from each advisor by name: "The Skeptic raised the cliff risk, and she's right to worry..."
3. Deliver a CLEAR recommendation — not a hedge. "Take the offer" or "Walk away" or "Counter with these terms"
4. ALWAYS include a dissent section: "However, The Devil's Advocate raised a point we cannot dismiss..."
5. Provide exactly 3 concrete action items the person should take IMMEDIATELY
6. End with the Council's confidence level: "The Council speaks with [high/moderate/divided] confidence"
7. Format your verdict EXACTLY like this:

---
**THE VERDICT**

[Your clear recommendation in 1-2 sentences]

**The Reasoning:**
[2-3 paragraphs weighing the arguments]

**The Dissent:**
[1 paragraph preserving the minority opinion]

**Your Next 3 Steps:**
1. [Immediate action]
2. [This week action]
3. [This month action]

*The Council speaks with [high/moderate/divided] confidence.*
---

FORMATTING: Follow the exact format above. This is the final word.
```

---

## 6. DETERMINISTIC ENGINE (Non-AI Technical Gravity)

### 6.1 Stakes Classifier (`backend/engine/stakes_classifier.py`)

**Purpose:** Parse user input, categorize the decision type, and assign a stakes level.

```python
# Keyword-based classification with scoring
CATEGORY_KEYWORDS = {
    "career": ["job", "offer", "salary", "promotion", "resign", "quit", "hire", "role", "position", "company", "work", "boss", "career", "title", "interview"],
    "financial": ["invest", "buy", "sell", "loan", "mortgage", "debt", "save", "spend", "price", "cost", "money", "fund", "stock", "crypto", "budget"],
    "relationship": ["marry", "divorce", "partner", "relationship", "dating", "love", "breakup", "family", "wedding", "move in", "kids", "children"],
    "health": ["surgery", "treatment", "doctor", "medical", "health", "therapy", "medication", "diagnosis", "hospital", "condition"],
    "education": ["college", "university", "degree", "study", "masters", "phd", "course", "school", "scholarship", "program", "graduate"],
    "housing": ["apartment", "house", "rent", "lease", "move", "relocate", "buy home", "mortgage", "roommate", "neighborhood", "city"],
}

# Stakes factors that increase stakes_level
HIGH_STAKES_INDICATORS = ["irreversible", "deadline", "large sum", "family impact", "health risk", "legal", "contract", "equity", "vest", "cliff", "sign by", "relocate", "permanent"]

def classify_decision(input_text: str) -> dict:
    """Returns: { category: str, stakes_level: int (1-10), factors: list[str] }"""
    text_lower = input_text.lower()
    
    # Score each category
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[category] = score
    
    category = max(scores, key=scores.get) if scores else "general"
    
    # Calculate stakes level
    factors = [ind for ind in HIGH_STAKES_INDICATORS if ind in text_lower]
    base_stakes = min(len(factors) * 2 + 3, 10)  # 3-10 range
    
    # Boost for dollar amounts
    import re
    dollar_matches = re.findall(r'\$[\d,]+k?', text_lower)
    if dollar_matches:
        base_stakes = min(base_stakes + 2, 10)
        factors.append(f"financial_amount: {', '.join(dollar_matches)}")
    
    return {
        "category": category,
        "stakes_level": base_stakes,
        "factors": factors,
    }
```

### 6.2 Convergence Detector (`backend/engine/convergence.py`)

**Purpose:** Determine how much the advisors agree or disagree.

```python
from difflib import SequenceMatcher

def calculate_convergence(arguments: list[dict]) -> float:
    """
    Takes a list of argument dicts with 'content' and 'position' fields.
    Returns a 0.0-1.0 convergence score.
    
    High convergence (>0.7) = advisors mostly agree
    Low convergence (<0.3) = sharp disagreement
    """
    if len(arguments) < 2:
        return 0.5
    
    # Position-based scoring
    positions = [a["position"] for a in arguments]
    position_counts = {}
    for p in positions:
        position_counts[p] = position_counts.get(p, 0) + 1
    
    # If >60% share a position, high convergence
    max_agreement = max(position_counts.values()) / len(positions)
    
    # Content similarity scoring (lightweight)
    contents = [a["content"] for a in arguments]
    similarities = []
    for i in range(len(contents)):
        for j in range(i + 1, len(contents)):
            # Use first 200 chars for speed
            ratio = SequenceMatcher(None, contents[i][:200], contents[j][:200]).ratio()
            similarities.append(ratio)
    
    avg_similarity = sum(similarities) / len(similarities) if similarities else 0.5
    
    # Weighted: 60% position agreement, 40% content similarity
    return round(max_agreement * 0.6 + avg_similarity * 0.4, 2)
```

### 6.3 Hash Chain (`backend/engine/hash_chain.py`)

**Purpose:** Create a tamper-evident chain of verdicts.

```python
import hashlib
import json
from datetime import datetime

def create_verdict_hash(verdict_content: str, prev_hash: str = None) -> str:
    """Create SHA-256 hash linking this verdict to the chain."""
    payload = json.dumps({
        "content": verdict_content,
        "prev_hash": prev_hash or "GENESIS",
        "timestamp": datetime.utcnow().isoformat(),
    }, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()

def create_dissent_hash(dissent_content: str, verdict_hash: str) -> str:
    """Create SHA-256 hash for a dissenting opinion, linked to its verdict."""
    payload = json.dumps({
        "dissent": dissent_content,
        "verdict_hash": verdict_hash,
        "timestamp": datetime.utcnow().isoformat(),
    }, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()
```

### 6.4 Dissent Logger (`backend/engine/dissent_logger.py`)

**Purpose:** Ensure minority opinions are NEVER deleted.

```python
def extract_dissent_from_verdict(verdict_text: str, advisor_arguments: list[dict]) -> dict | None:
    """
    Parse the Chair's verdict to find which advisor dissented.
    Returns the dissenting advisor and their original argument.
    """
    # The Chair's verdict format includes "The Dissent:" section
    if "The Dissent:" not in verdict_text:
        return None
    
    dissent_section = verdict_text.split("The Dissent:")[1].split("Your Next")[0].strip()
    
    # Find which advisor was mentioned as dissenting
    advisor_names = ["Skeptic", "Strategist", "Numbers", "Devil's Advocate"]
    dissenting_advisor = None
    for name in advisor_names:
        if name.lower() in dissent_section.lower():
            dissenting_advisor = name
            break
    
    if not dissenting_advisor:
        dissenting_advisor = "Devil's Advocate"  # default dissenter
    
    return {
        "advisor_name": dissenting_advisor,
        "dissent_content": dissent_section,
    }
```

---

## 7. BACKEND API (FastAPI)

### 7.1 Entry Point (`backend/main.py`)

```python
# FastAPI server with WebSocket for live debate streaming
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sqlite3
import json
import asyncio

app = FastAPI(title="The Council API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connections for live debate streaming
active_connections: dict[str, list[WebSocket]] = {}

@app.post("/api/decisions")
async def create_decision(body: dict):
    """
    Accept a decision from the frontend.
    1. Classify stakes
    2. Create DB record
    3. Create Band room
    4. Trigger debate
    5. Return decision_id for WebSocket subscription
    """
    pass  # Implementation below in section 7.2

@app.websocket("/ws/debate/{decision_id}")
async def debate_stream(websocket: WebSocket, decision_id: str):
    """Stream live debate messages to frontend."""
    pass  # Implementation below in section 7.2

@app.get("/api/decisions/{decision_id}")
async def get_decision(decision_id: str):
    """Get full decision with arguments, verdict, dissent."""
    pass

@app.get("/api/decisions")
async def list_decisions():
    """List all past decisions."""
    pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 7.2 Debate Orchestration Flow

```
User submits decision
       │
       ▼
┌──────────────────┐
│ Stakes Classifier │ ──→ category + stakes_level + factors
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Create DB Row   │ ──→ decisions table
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Brightdata Query │ ──→ If career/financial: fetch salary/market data
└────────┬─────────┘     Store in evidence table
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    BAND ROOM DEBATE                          │
│                                                              │
│  Round 1: Initial Positions                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ POST to Band room:                                   │   │
│  │ "@Skeptic @Strategist @Numbers @DevilsAdvocate       │   │
│  │  The user is facing this decision: [input_text]      │   │
│  │  Category: [category] | Stakes: [level]/10           │   │
│  │  Evidence: [brightdata_data if available]             │   │
│  │  Give your initial assessment. Address the user."    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Each advisor responds → stored in arguments table           │
│  Each response streamed via WebSocket to frontend            │
│                                                              │
│  Round 2: Cross-Examination (if time allows)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ "@DevilsAdvocate challenge the strongest argument.   │   │
│  │  @Skeptic @Strategist defend your positions."        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Round 3: Verdict                                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ "@Chair The Council has debated. Review all           │   │
│  │  arguments and deliver your verdict."                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Chair responds → verdict + dissent extracted                │
│  Convergence score calculated                                │
│  Hash chain updated                                          │
│  Everything stored in DB                                     │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
  Frontend receives verdict via WebSocket
  Renders verdict panel with dissent
```

### 7.3 Debate Orchestrator Pseudocode

```python
# backend/main.py — inside create_decision endpoint

async def orchestrate_debate(decision_id: str, input_text: str, evidence: dict = None):
    """
    This function:
    1. Sends the decision to the Band room (triggering all advisors)
    2. Polls Band for advisor responses
    3. Streams each response to the frontend via WebSocket
    4. After all advisors respond, triggers the Chair
    5. Extracts verdict + dissent, stores everything
    """
    import httpx
    
    BAND_API_BASE = "https://app.band.ai/api/v1/agent"
    # Use one of the advisor's API keys to send the opening message
    # OR use the Human API if available
    
    # Step 1: Send opening message to Band room
    opening_message = f"""The Council has been convened.

**The Decision:** {input_text}

**Category:** {classification['category']}
**Stakes Level:** {classification['stakes_level']}/10
**Key Factors:** {', '.join(classification['factors'])}
"""
    if evidence:
        opening_message += f"\n**Market Evidence (Brightdata):**\n{json.dumps(evidence, indent=2)}"
    
    opening_message += "\n\nAdvisors, give your initial assessments. Address the person directly."
    
    # Step 2: Wait for responses (poll Band or listen via WebSocket)
    # Step 3: Stream to frontend
    # Step 4: After 4 advisors respond, trigger Chair
    # Step 5: Store verdict, calculate convergence, hash chain
```

**IMPORTANT NOTE FOR FLASH:** The debate orchestration can be simplified. Instead of polling Band messages in real-time (complex), we can use a **simulated approach** for the hackathon:

1. The backend calls each LLM directly (via Featherless/AI/ML API)
2. Posts each response TO Band (for observability in the Band console)
3. Streams each response to the frontend via WebSocket

This gives us BOTH: the live debate feel on the frontend AND the full conversation visible in Band. It's pragmatic and impressive.

---

## 8. BRIGHTDATA INTEGRATION

```python
# backend/integrations/brightdata.py

import httpx
import os

BRIGHTDATA_API_KEY = os.getenv("BRIGHTDATA_API_KEY")

async def fetch_salary_data(job_title: str, location: str = None) -> dict:
    """
    Use Brightdata Web Scraper API to fetch salary data.
    Falls back to static data if API unavailable.
    """
    if not BRIGHTDATA_API_KEY:
        return get_fallback_salary_data(job_title)
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                "https://api.brightdata.com/datasets/v3/trigger",
                headers={"Authorization": f"Bearer {BRIGHTDATA_API_KEY}"},
                json={
                    "dataset_id": "gd_l1viktl72bvb7bjuj0",  # Job listings dataset
                    "query": {
                        "keyword": job_title,
                        "location": location or "United States",
                    },
                    "limit": 5,
                },
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    
    return get_fallback_salary_data(job_title)

def get_fallback_salary_data(job_title: str) -> dict:
    """Static salary ranges for common roles (used when Brightdata is unavailable)."""
    SALARY_DATA = {
        "software engineer": {"min": 85000, "max": 165000, "median": 120000, "currency": "USD"},
        "product manager": {"min": 95000, "max": 180000, "median": 135000, "currency": "USD"},
        "data scientist": {"min": 90000, "max": 170000, "median": 125000, "currency": "USD"},
        "designer": {"min": 70000, "max": 140000, "median": 100000, "currency": "USD"},
        "marketing manager": {"min": 65000, "max": 130000, "median": 90000, "currency": "USD"},
        "default": {"min": 50000, "max": 120000, "median": 75000, "currency": "USD"},
    }
    
    title_lower = job_title.lower()
    for key, data in SALARY_DATA.items():
        if key in title_lower:
            return {"source": "market_benchmark", "role": job_title, **data}
    
    return {"source": "market_benchmark", "role": job_title, **SALARY_DATA["default"]}
```

---

## 9. LLM ROUTER

```python
# backend/integrations/llm_router.py
from openai import OpenAI
import os

def get_llm_client(provider: str) -> OpenAI:
    """Get OpenAI-compatible client for the specified provider."""
    if provider == "featherless":
        return OpenAI(
            base_url="https://api.featherless.ai/v1",
            api_key=os.getenv("FEATHERLESS_API_KEY"),
        )
    elif provider == "aimlapi":
        return OpenAI(
            base_url="https://api.aimlapi.com/v1",
            api_key=os.getenv("AIMLAPI_KEY"),
        )
    else:
        raise ValueError(f"Unknown provider: {provider}")

ADVISOR_MODELS = {
    "skeptic":         {"provider": "featherless", "model": "Qwen/Qwen3.5"},
    "strategist":      {"provider": "featherless", "model": "meta-llama/Llama-4-Maverick-17B-128E-Instruct"},
    "numbers":         {"provider": "featherless", "model": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B"},
    "devils_advocate": {"provider": "featherless", "model": "meta-llama/Llama-4-Scout-17B-16E-Instruct"},
    "chair":           {"provider": "aimlapi",     "model": "gpt-4o-mini"},
}

async def get_advisor_response(advisor_role: str, system_prompt: str, user_message: str) -> str:
    """Get a response from the specified advisor's LLM."""
    config = ADVISOR_MODELS[advisor_role]
    client = get_llm_client(config["provider"])
    
    response = client.chat.completions.create(
        model=config["model"],
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0.8,
        max_tokens=500,
    )
    
    return response.choices[0].message.content
```

---

## 10. FRONTEND DESIGN SYSTEM

### 10.1 Color Palette (Dark Theme)

```css
/* globals.css — Design Tokens */
:root {
    /* Background layers */
    --bg-primary: #0A0A0F;        /* Deepest background */
    --bg-secondary: #12121A;      /* Card background */
    --bg-tertiary: #1A1A2E;       /* Elevated surface */
    --bg-glass: rgba(26, 26, 46, 0.6);  /* Glassmorphism */
    
    /* Text */
    --text-primary: #F0F0F5;      /* Main text */
    --text-secondary: #9CA3AF;    /* Muted text */
    --text-muted: #6B7280;        /* Very muted */
    
    /* Advisor Colors */
    --skeptic: #F59E0B;           /* Amber */
    --strategist: #8B5CF6;        /* Purple */
    --numbers: #10B981;           /* Emerald */
    --devils-advocate: #EF4444;   /* Red */
    --chair: #6366F1;             /* Indigo */
    
    /* UI Colors */
    --accent: #6366F1;            /* Primary accent (indigo) */
    --accent-glow: rgba(99, 102, 241, 0.3);
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);
    
    /* Stakes Colors */
    --stakes-low: #10B981;
    --stakes-medium: #F59E0B;
    --stakes-high: #EF4444;
    --stakes-critical: #DC2626;
    
    /* Glassmorphism */
    --glass-bg: rgba(18, 18, 26, 0.7);
    --glass-border: rgba(255, 255, 255, 0.06);
    --glass-blur: 20px;
    
    /* Typography */
    --font-sans: 'Inter', -apple-system, sans-serif;
    --font-display: 'Outfit', -apple-system, sans-serif;
    
    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;
    
    /* Border Radius */
    --radius-sm: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;
    --radius-full: 9999px;
    
    /* Transitions */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 10.2 Glassmorphism Card Pattern

```css
.glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    transition: border-color var(--transition-base);
}
.glass-card:hover {
    border-color: var(--border-hover);
}
```

### 10.3 Font Loading

```javascript
// layout.js — Google Fonts
import { Inter, Outfit } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' })
```

### 10.4 Key Component Specifications

#### Landing Page (`page.js`)
- Full-screen dark hero with animated gradient
- Tagline: "The room everyone deserves."
- Subtitle: "Five brilliant advisors debate your most important decisions."
- CTA button: "Convene The Council" → routes to `/council`
- Below: 3 feature cards (Real Debate, Preserved Dissent, Live Data)
- Footer with sponsor logos (Band, AI/ML API, Featherless, Brightdata)

#### Council Chamber (`council/page.js`)
- **Top:** Decision input form (textarea + submit button)
- **Center:** The Council Table — a visual representation of 5 advisor seats in a semicircle with the user's seat facing them
- **Below:** Live debate stream — advisor responses appear one by one with their color/icon, animated typing effect
- **Right Panel (or bottom on mobile):** Stakes indicator, convergence meter
- **Bottom:** Verdict panel (appears after Chair speaks) — full verdict with dissent section highlighted differently

#### Advisor Card (`AdvisorCard.js`)
- Circular avatar with advisor color glow
- Name and role
- "Speaking" animation when their response is streaming
- Their argument text appears in a glass card below

---

## 11. SPONSOR INTEGRATION DEPTH

| Sponsor | Level | Integration |
|---------|-------|-------------|
| **Band.ai** | **L5** | THE CORE — all 5 agents run as Band remote agents, communicate via @mentions in a Band room. The entire debate is observable in the Band console. Room creation, participant management, message routing, ALL through Band. |
| **Featherless AI** | **L4** | 4 of 5 advisors run on Featherless models (Qwen3.5, Llama-4-Maverick, DeepSeek-R1-Distill, Llama-4-Scout). Different models for different advisor personalities = genuine model diversity. |
| **AI/ML API** | **L4** | The Chair (most important advisor) runs on GPT-4o-mini via AI/ML API. The synthesis/verdict requires the highest quality model. Function calling for action item generation. |
| **Brightdata** | **L3-L4** | Real-time salary and market data grounding. When a career decision is submitted, Brightdata scrapes current salary data to ground The Numbers' analysis in reality, not LLM hallucination. |

---

## 12. HOW WE BEAT EQUIPULSE (THE #1 COMPETITOR)

### EquiPulse Analysis
- **Team:** 5 people (EquiSaaS BD)
- **Tech:** React 19, Tailwind, Firebase, DuckDB, 15 languages, Playwright tests, Cloudflare
- **Size:** Massive codebase (~80+ files, 5 MCP servers, i18n for 15 languages)
- **Strength:** Production-grade enterprise POS for emerging markets. VERY polished.

### Why We STILL Win

1. **They barely use Band.** Look at their tech tags: "Featherless, Gemini AI, AI/ML API." Band is mentioned but the core architecture is a standard React app with Firebase. Their agents (if any) are bolt-on. THE COUNCIL makes Band the IRREPLACEABLE core — remove Band and the product doesn't exist. Judges evaluating "use of Band" will see EquiPulse as an app that could work without Band, and THE COUNCIL as an app that IS Band.

2. **5 people vs 1 person.** Judges know the context. A solo builder shipping a working multi-agent debate system with premium UI is MORE impressive per-person than a 5-person team shipping a larger app. The "wow per capita" is asymmetric.

3. **They solve a KNOWN problem (SME POS).** We solve a FELT problem (your life decisions). EquiPulse is impressive but it's SAP-for-Bangladesh — judges RESPECT it but don't CRAVE it. THE COUNCIL makes judges reach for their phones. Desire > respect.

4. **Demo test.** EquiPulse demo: upload CSV, see charts, swipe cards. Impressive. Clinical. THE COUNCIL demo: "Should I take this $95K offer with 0.4% equity?" → five minds fight about YOUR future → you get a verdict AND a dissenting opinion AND three steps to take tomorrow. **One demo makes you nod. The other makes you FEEL.**

5. **Their Band integration is likely cosmetic.** Based on the repo, there are zero Band-related files. No `thenvoi`, no `band-sdk`, no `agent_config.yaml`. Their agents are likely internal Gemini calls, not Band room participants. This is a CRITICAL weakness in a hackathon ABOUT Band.

---

## 13. ENVIRONMENT VARIABLES

```bash
# .env.local (NEVER commit)

# Band.ai
BAND_SKEPTIC_AGENT_ID=uuid-here
BAND_SKEPTIC_API_KEY=key-here
BAND_STRATEGIST_AGENT_ID=uuid-here
BAND_STRATEGIST_API_KEY=key-here
BAND_NUMBERS_AGENT_ID=uuid-here
BAND_NUMBERS_API_KEY=key-here
BAND_DEVILS_ADVOCATE_AGENT_ID=uuid-here
BAND_DEVILS_ADVOCATE_API_KEY=key-here
BAND_CHAIR_AGENT_ID=uuid-here
BAND_CHAIR_API_KEY=key-here

# LLM Providers
FEATHERLESS_API_KEY=your-featherless-key
AIMLAPI_KEY=your-aimlapi-key

# Brightdata
BRIGHTDATA_API_KEY=your-brightdata-key

# Frontend (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 14. BUILD ORDER FOR GEMINI FLASH

**READ THIS SECTION CAREFULLY, FLASH. This is your execution sequence.**

### Phase 1: Scaffold (30 min)
1. Create project directory structure (see Section 3)
2. Initialize `frontend/` with Next.js: `npx -y create-next-app@latest ./` (with App Router, no Tailwind, no TypeScript — plain JavaScript)
3. Create `backend/requirements.txt`:
   ```
   fastapi==0.115.0
   uvicorn==0.30.0
   websockets==13.0
   httpx==0.27.0
   openai==1.40.0
   python-dotenv==1.0.0
   band-sdk[langgraph]==latest
   langchain-openai==0.2.0
   langgraph==0.2.0
   ```
4. Set up `.env.local` template
5. Set up `.gitignore`
6. Create SQLite database initialization in `backend/database/models.py`
7. Create `backend/config.py` for env loading

### Phase 2: Backend Core (60 min)
1. Implement `backend/engine/stakes_classifier.py` (Section 6.1)
2. Implement `backend/engine/convergence.py` (Section 6.2)
3. Implement `backend/engine/hash_chain.py` (Section 6.3)
4. Implement `backend/engine/dissent_logger.py` (Section 6.4)
5. Implement `backend/integrations/llm_router.py` (Section 9)
6. Implement `backend/integrations/brightdata.py` (Section 8)
7. Implement `backend/main.py` FastAPI server with:
   - POST `/api/decisions` — create decision, classify, start debate
   - GET `/api/decisions/{id}` — get full decision with verdict
   - GET `/api/decisions` — list all decisions
   - WebSocket `/ws/debate/{id}` — live debate stream

### Phase 3: Band Agent Registration (20 min)
1. Go to `app.band.ai/agents` 
2. Register 5 remote agents (Skeptic, Strategist, Numbers, Devils Advocate, Chair)
3. Copy all UUIDs and API keys to `.env.local`
4. Create `backend/agent_config.yaml` with credentials
5. Test: run a simple "hello" agent script to verify Band connection

### Phase 4: Agent Implementation (60 min)
1. Implement the 5 advisor agent files (Section 5.2)
2. Create `backend/run_agents.py` to launch all 5 in parallel
3. Test: send a message in a Band room and verify all agents respond
4. Implement the debate orchestration flow in `backend/main.py` (Section 7.2-7.3)

### Phase 5: Frontend (90 min)
1. Set up `globals.css` with the full design system (Section 10.1-10.2)
2. Build the Landing Page (`page.js`) — hero section with animated gradient
3. Build the Council Chamber (`council/page.js`):
   - Decision input form
   - Council table visualization (5 advisor seats)
   - Live debate stream (WebSocket connected)
   - Verdict panel
4. Build all components: AdvisorCard, DebateStream, VerdictPanel, StakesIndicator, ConvergenceMeter
5. Connect frontend to backend API + WebSocket

### Phase 6: Integration & Polish (30 min)
1. End-to-end test: submit decision → watch debate → see verdict
2. Fix any broken flows
3. Add micro-animations (fade-in, typing effect, glow on active advisor)
4. Ensure mobile responsiveness
5. Add sponsor logos to footer

### Phase 7: Demo & Submit (60 min)
1. Record demo video (narrated, face on camera)
2. Write README.md (judge-facing)
3. Create slides PDF
4. Deploy frontend to Vercel
5. Submit on lablab.ai

---

## 15. DEMO SCRIPT

**Scene 1: Hook (15 sec)**
"Everyone has THAT decision keeping them up at night. The job offer you're not sure about. The lease you might regret. Until now, you faced it alone. THE COUNCIL changes that."

**Scene 2: Submit Decision (15 sec)**
Show the landing page. Type in: "I got offered $95K base with 0.4% equity, 4-year vest, one-year cliff at a Series B startup. I currently make $82K at a stable company. Should I take it?"
Click "Convene The Council."

**Scene 3: The Debate (45 sec)**
Watch advisors respond one by one:
- The Skeptic warns about the one-year cliff
- The Numbers pulls salary benchmarks
- The Strategist talks about the door it opens
- The Devil's Advocate challenges everyone

**Scene 4: The Verdict (15 sec)**
The Chair delivers: "Counter. Ask for $110K and a 6-month cliff. The role is worth taking — but not at this number."
Show the dissenting opinion preserved below.

**Scene 5: Technical Depth (15 sec)**
Quick flash of: Band console showing the room, database with hash chain, Brightdata evidence, convergence score.

**Scene 6: Close (10 sec)**
"Five advisors. One room. Your decision. The Council is always in session."

---

## 16. CRITICAL WARNINGS FOR FLASH

1. **DO NOT use Claude models via AI/ML API** — they cost $15/M tokens. Use GPT-4o-mini ($0.15/$0.60).
2. **DO NOT let agents run in infinite loops** — each advisor gets ONE call per round. Hard-cap at 3 rounds.
3. **DO NOT build a database ORM** — use raw `sqlite3` for speed. This is a hackathon.
4. **DO NOT over-engineer the Band integration** — the pragmatic approach (Section 7.3 note) is fine: call LLMs directly, post results to Band for observability.
5. **DO NOT skip the frontend** — Steve (organizer) explicitly said "make a good landing page and frontend."
6. **DO NOT use Tailwind** — use vanilla CSS with the design tokens in Section 10.
7. **DO NOT spend more than 15 minutes debugging** — if stuck, rewrite or bypass.
8. **ALWAYS commit after each phase** — `git add -A && git commit -m "feat: [phase description]"`

---

*Architecture crafted by Claude Opus 4.6 for execution by Gemini 3.5 Flash.*
*Built for Shree Shah. Designed for Rank 1.*
