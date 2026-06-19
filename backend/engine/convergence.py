from difflib import SequenceMatcher

def calculate_convergence(arguments: list[dict]) -> float:
    """
    Takes a list of argument dicts with 'content' and 'position' fields.
    Returns a 0.0 - 1.0 convergence score.
    
    High convergence (>0.7) = advisors mostly agree
    Low convergence (<0.3) = sharp disagreement / dissent
    """
    if len(arguments) < 2:
        return 0.5
        
    # Position-based scoring
    positions = [a.get("position", "nuanced").lower() for a in arguments]
    position_counts = {}
    for p in positions:
        position_counts[p] = position_counts.get(p, 0) + 1
        
    # Max share of agreement on a single position
    max_agreement = max(position_counts.values()) / len(positions)
    
    # Content similarity scoring (lightweight lexical comparison)
    contents = [a.get("content", "") for a in arguments]
    similarities = []
    for i in range(len(contents)):
        for j in range(i + 1, len(contents)):
            # Use first 200 characters for performance
            ratio = SequenceMatcher(None, contents[i][:200], contents[j][:200]).ratio()
            similarities.append(ratio)
            
    avg_similarity = sum(similarities) / len(similarities) if similarities else 0.5
    
    # Weighted calculation: 60% position agreement, 40% textual similarity
    convergence = max_agreement * 0.6 + avg_similarity * 0.4
    return round(min(max(convergence, 0.0), 1.0), 2)
