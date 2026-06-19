import os
from openai import OpenAI
from backend.config import FEATHERLESS_API_KEY, AIMLAPI_KEY

def get_llm_client(provider: str) -> OpenAI:
    """Get an OpenAI-compatible client for the specified provider."""
    if provider == "featherless":
        if not FEATHERLESS_API_KEY:
            raise ValueError("FEATHERLESS_API_KEY is not set in environment.")
        return OpenAI(
            base_url="https://api.featherless.ai/v1",
            api_key=FEATHERLESS_API_KEY,
        )
    elif provider == "aimlapi":
        if not AIMLAPI_KEY:
            raise ValueError("AIMLAPI_KEY is not set in environment.")
        return OpenAI(
            base_url="https://api.aimlapi.com/v1",
            api_key=AIMLAPI_KEY,
        )
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")

# Models configured for advisor personalities
ADVISOR_MODELS = {
    "skeptic":         {"provider": "featherless", "model": "Qwen/Qwen2.5-32B-Instruct"},
    "strategist":      {"provider": "featherless", "model": "meta-llama/Meta-Llama-3.1-70B-Instruct"},
    "numbers":         {"provider": "featherless", "model": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B"},
    "devils_advocate": {"provider": "featherless", "model": "meta-llama/Meta-Llama-3.1-8B-Instruct"},
    "chair":           {"provider": "aimlapi",     "model": "gpt-4o-mini"},
}

async def get_advisor_response(advisor_role: str, system_prompt: str, user_message: str) -> str:
    """Get a response from the specified advisor's LLM."""
    if advisor_role not in ADVISOR_MODELS:
        raise ValueError(f"Unknown advisor role: {advisor_role}")
        
    config = ADVISOR_MODELS[advisor_role]
    client = get_llm_client(config["provider"])
    
    # We use sync completions inside an async wrapper or call it directly.
    # To keep it simple, since OpenAI client is synchronous, we run it in a thread executor if needed
    # or just execute synchronously as it runs in the FastAPI async loop.
    # To prevent blocking, we can run in executor or call it. We'll run it in executor for safety.
    import asyncio
    
    def call_completions():
        response = client.chat.completions.create(
            model=config["model"],
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.8,
            max_tokens=600,
        )
        return response.choices[0].message.content

    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, call_completions)
