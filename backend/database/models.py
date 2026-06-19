import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "council.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create decisions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        input_text TEXT NOT NULL,
        category TEXT NOT NULL,
        stakes_level INTEGER NOT NULL,
        stakes_factors TEXT,
        status TEXT DEFAULT 'pending',
        band_room_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        concluded_at TIMESTAMP
    );
    """)
    
    # Create advisors table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS advisors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        model TEXT NOT NULL,
        provider TEXT NOT NULL,
        personality TEXT NOT NULL,
        band_agent_id TEXT,
        color TEXT NOT NULL
    );
    """)
    
    # Create arguments table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS arguments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        decision_id TEXT NOT NULL,
        advisor_id TEXT NOT NULL,
        content TEXT NOT NULL,
        position TEXT NOT NULL,
        round INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (decision_id) REFERENCES decisions(id),
        FOREIGN KEY (advisor_id) REFERENCES advisors(id)
    );
    """)
    
    # Create verdicts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verdicts (
        id TEXT PRIMARY KEY,
        decision_id TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        reasoning TEXT NOT NULL,
        confidence TEXT NOT NULL,
        action_items TEXT,
        convergence_score FLOAT,
        hash TEXT NOT NULL,
        prev_hash TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (decision_id) REFERENCES decisions(id)
    );
    """)
    
    # Create dissents table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dissents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        verdict_id TEXT NOT NULL,
        advisor_id TEXT NOT NULL,
        dissent_content TEXT NOT NULL,
        hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (verdict_id) REFERENCES verdicts(id),
        FOREIGN KEY (advisor_id) REFERENCES advisors(id)
    );
    """)
    
    # Create evidence table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        decision_id TEXT NOT NULL,
        source TEXT NOT NULL,
        data_type TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (decision_id) REFERENCES decisions(id)
    );
    """)
    
    conn.commit()
    conn.close()
    print("SQLite database initialized successfully.")

if __name__ == "__main__":
    init_db()
