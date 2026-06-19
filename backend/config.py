import os
from dotenv import load_dotenv

# Load from .env.local at project root, fall back to .env
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv(os.path.join(PROJECT_ROOT, ".env.local"))
load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

# Band.ai Configuration
BAND_AGENTS = {
    "skeptic": {
        "id": os.getenv("BAND_SKEPTIC_AGENT_ID"),
        "key": os.getenv("BAND_SKEPTIC_API_KEY"),
        "name": "The Skeptic",
        "color": "#B25E00",
        "icon": "🔍"
    },
    "strategist": {
        "id": os.getenv("BAND_STRATEGIST_AGENT_ID"),
        "key": os.getenv("BAND_STRATEGIST_API_KEY"),
        "name": "The Strategist",
        "color": "#5E35B1",
        "icon": "📈"
    },
    "numbers": {
        "id": os.getenv("BAND_NUMBERS_AGENT_ID"),
        "key": os.getenv("BAND_NUMBERS_API_KEY"),
        "name": "The Numbers",
        "color": "#00796B",
        "icon": "🧮"
    },
    "devils_advocate": {
        "id": os.getenv("BAND_DEVILS_ADVOCATE_AGENT_ID"),
        "key": os.getenv("BAND_DEVILS_ADVOCATE_API_KEY"),
        "name": "The Devil's Advocate",
        "color": "#C62828",
        "icon": "😈"
    },
    "chair": {
        "id": os.getenv("BAND_CHAIR_AGENT_ID"),
        "key": os.getenv("BAND_CHAIR_API_KEY"),
        "name": "The Chair",
        "color": "#1A237E",
        "icon": "⚖️"
    }
}

# LLM Keys
FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY")
AIMLAPI_KEY = os.getenv("AIMLAPI_KEY")

# Brightdata Key
BRIGHTDATA_API_KEY = os.getenv("BRIGHTDATA_API_KEY")

def verify_config():
    """Verify that vital credentials exist, warning user of missing elements."""
    missing = []
    
    # Check at least one LLM key
    if not FEATHERLESS_API_KEY:
        missing.append("FEATHERLESS_API_KEY")
    if not AIMLAPI_KEY:
        missing.append("AIMLAPI_KEY")
        
    # Check Band agent keys
    for role, cfg in BAND_AGENTS.items():
        if not cfg["id"] or not cfg["key"]:
            missing.append(f"BAND_{role.upper()}_AGENT_ID/API_KEY")
            
    if missing:
        print(f"⚠️ Warning: Missing configuration variables: {', '.join(missing)}")
        print("Please copy .env.template to .env.local and fill them in.")
        return False
    return True
