def extract_dissent_from_verdict(verdict_text: str, advisor_arguments: list[dict]) -> dict | None:
    """
    Parse the Chair's structured verdict to find which advisor's points were highlighted
    in the dissenting opinion.
    Returns: { 'advisor_role': str, 'dissent_content': str }
    """
    if "**The Dissent:**" not in verdict_text:
        if "The Dissent:" in verdict_text:
            marker = "The Dissent:"
        else:
            return None
    else:
        marker = "**The Dissent:**"
        
    parts = verdict_text.split(marker)
    if len(parts) < 2:
        return None
        
    # Extract the block below dissent section, stopping before the next section
    dissent_section = parts[1]
    if "**Your Next" in dissent_section:
        dissent_section = dissent_section.split("**Your Next")[0]
    elif "Your Next" in dissent_section:
        dissent_section = dissent_section.split("Your Next")[0]
    dissent_section = dissent_section.strip()
    
    # Identify which advisor was dissenting by searching advisor roles/names
    roles_map = {
        "skeptic": ["skeptic", "risk", "critic"],
        "strategist": ["strategist", "vision", "long-term", "opportunity"],
        "numbers": ["numbers", "quantitative", "calculation", "abacus", "data"],
        "devils_advocate": ["devil's advocate", "devils advocate", "rebellious", "opposite"]
    }
    
    detected_role = "devils_advocate"  # Default fallback
    dissent_lower = dissent_section.lower()
    
    for role, keywords in roles_map.items():
        for keyword in keywords:
            if keyword in dissent_lower:
                detected_role = role
                break
                
    return {
        "advisor_role": detected_role,
        "dissent_content": dissent_section
    }
