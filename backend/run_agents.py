import asyncio
import httpx
from backend.config import BAND_AGENTS

BAND_BASE_URL = "https://app.band.ai/api/v1/agent"

async def check_agent(role: str, config: dict):
    agent_id = config["id"]
    api_key = config["key"]
    name = config["name"]
    
    if not agent_id or not api_key:
        print(f"❌ {name} ({role}): Credentials missing in .env.local")
        return False
        
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{BAND_BASE_URL}/me",
                headers={"X-API-Key": api_key}
            )
            if resp.status_code == 200:
                data = resp.json()
                print(f"✅ {name} ({role}): Connected! Band Handle: @{data.get('handle', 'unknown')}")
                return True
            else:
                print(f"❌ {name} ({role}): Auth failed. Status code: {resp.status_code}, Response: {resp.text}")
                return False
    except Exception as e:
        print(f"❌ {name} ({role}): Connection error: {e}")
        return False

async def main():
    print("=" * 60)
    print("🔍 THE COUNCIL — Band.ai Remote Agent Status Diagnostics")
    print("=" * 60)
    
    tasks = [check_agent(role, cfg) for role, cfg in BAND_AGENTS.items()]
    results = await asyncio.gather(*tasks)
    
    print("-" * 60)
    success_count = sum(1 for r in results if r)
    print(f"Summary: {success_count}/{len(BAND_AGENTS)} agents successfully authenticated with Band.ai.")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
