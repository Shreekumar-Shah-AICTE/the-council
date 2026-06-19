import httpx
from backend.config import BRIGHTDATA_API_KEY

async def fetch_salary_data(job_title: str, location: str = None) -> dict:
    """
    Use Brightdata Dataset API to fetch salary data for a given job.
    Falls back to a curated local database if API key is not configured or fails.
    """
    if not BRIGHTDATA_API_KEY:
        print("Brightdata API Key not set. Falling back to local market benchmarks.")
        return get_fallback_salary_data(job_title)
        
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                "https://api.brightdata.com/datasets/v3/trigger",
                headers={"Authorization": f"Bearer {BRIGHTDATA_API_KEY}"},
                json={
                    "dataset_id": "gd_l1viktl72bvb7bjuj0",  # Glassdoor job listings / salary dataset
                    "query": {
                        "keyword": job_title,
                        "location": location or "United States",
                    },
                    "limit": 5,
                },
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "brightdata",
                    "role": job_title,
                    "location": location or "United States",
                    "raw_data": data
                }
    except Exception as e:
        print(f"Brightdata request failed: {e}. Falling back to local benchmarks.")
        
    return get_fallback_salary_data(job_title)

def get_fallback_salary_data(job_title: str) -> dict:
    """Curated fallback salary ranges for common professional roles."""
    SALARY_DATA = {
        "software engineer": {"min": 85000, "max": 175000, "median": 125000, "currency": "USD"},
        "product manager": {"min": 95000, "max": 190000, "median": 140000, "currency": "USD"},
        "data scientist": {"min": 90000, "max": 180000, "median": 130000, "currency": "USD"},
        "designer": {"min": 70000, "max": 145000, "median": 105000, "currency": "USD"},
        "marketing manager": {"min": 65000, "max": 135000, "median": 95000, "currency": "USD"},
        "default": {"min": 60000, "max": 130000, "median": 85000, "currency": "USD"},
    }
    
    title_lower = job_title.lower()
    for key, data in SALARY_DATA.items():
        if key in title_lower:
            return {"source": "market_benchmark", "role": job_title, **data}
            
    return {"source": "market_benchmark", "role": job_title, **SALARY_DATA["default"]}
