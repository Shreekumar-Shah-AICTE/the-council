import re

CATEGORY_KEYWORDS = {
    "career": ["job", "offer", "salary", "promotion", "resign", "quit", "hire", "role", "position", "company", "work", "boss", "career", "title", "interview"],
    "financial": ["invest", "buy", "sell", "loan", "mortgage", "debt", "save", "spend", "price", "cost", "money", "fund", "stock", "crypto", "budget"],
    "relationship": ["marry", "divorce", "partner", "relationship", "dating", "love", "breakup", "family", "wedding", "move in", "kids", "children"],
    "health": ["surgery", "treatment", "doctor", "medical", "health", "therapy", "medication", "diagnosis", "hospital", "condition"],
    "education": ["college", "university", "degree", "study", "masters", "phd", "course", "school", "scholarship", "program", "graduate"],
    "housing": ["apartment", "house", "rent", "lease", "move", "relocate", "buy home", "mortgage", "roommate", "neighborhood", "city"],
}

HIGH_STAKES_INDICATORS = ["irreversible", "deadline", "large sum", "family impact", "health risk", "legal", "contract", "equity", "vest", "cliff", "sign by", "relocate", "permanent"]

def classify_decision(input_text: str) -> dict:
    """
    Parses user input, categorizes the decision type, and assigns a stakes level (1-10).
    Returns: { 'category': str, 'stakes_level': int, 'factors': list[str] }
    """
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
    base_stakes = min(len(factors) * 2 + 3, 10)  # Range 3-10
    
    # Boost for dollar amounts
    dollar_matches = re.findall(r'\$[\d,]+k?', text_lower)
    if dollar_matches:
        base_stakes = min(base_stakes + 2, 10)
        factors.append(f"financial_amount: {', '.join(dollar_matches)}")
        
    return {
        "category": category,
        "stakes_level": base_stakes,
        "factors": factors
    }

if __name__ == "__main__":
    # Test cases
    test_input = "Should I accept a software engineer role offering $120k with a 1-year cliff and relocation?"
    print(classify_decision(test_input))
