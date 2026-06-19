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
    """Create SHA-256 hash for a dissenting opinion, linked to its parent verdict."""
    payload = json.dumps({
        "dissent": dissent_content,
        "verdict_hash": verdict_hash,
        "timestamp": datetime.utcnow().isoformat(),
    }, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()
