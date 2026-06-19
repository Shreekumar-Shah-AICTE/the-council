import asyncio
from backend.integrations.llm_router import get_advisor_response

async def test_agent(role: str, prompt: str):
    print(f"Testing {role}...")
    try:
        response = await get_advisor_response(role, "You are a helpful assistant.", prompt)
        print(f"✅ {role} response received successfully: {response[:60]}...")
        return True
    except Exception as e:
        print(f"❌ {role} failed: {e}")
        return False

async def main():
    print("=" * 60)
    print("🤖 THE COUNCIL — LLM Provider Keys Diagnostics")
    print("=" * 60)
    
    roles = ["skeptic", "strategist", "numbers", "devils_advocate", "chair"]
    results = []
    
    for role in roles:
        res = await test_agent(role, "Hello Council member, test response.")
        results.append(res)
        await asyncio.sleep(0.5) # small cooling window

    print("-" * 60)
    success = sum(1 for r in results if r)
    print(f"Summary: {success}/5 LLM agents successfully verified.")
    print("=" * 60)

if __name__ == "__main__":
    import os
    # Load env local
    from backend.config import verify_config
    verify_config()
    asyncio.run(main())
