"""
Rotes Regal Backend - Flask Application

A digital library focused on leftist works with scheduled updates during low-usage times.
"""

import os
import json
import sqlite3
from datetime import datetime, date, time as dt_time
from pathlib import Path
from flask import Flask, jsonify, request, render_template_string, send_from_directory

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "ernte"
FRONTEND_DIR = BASE_DIR / "frontend"
DB_PATH = BASE_DIR / "backend" / "rotes_regal.db"

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path='')

# ============================================================================
# DATABASE SETUP
# ============================================================================

def get_db():
    """Get database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database schema."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Publishers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS publishers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            country TEXT,
            type TEXT DEFAULT 'verlag',
            source_type TEXT,
            last_update DATE,
            update_status TEXT DEFAULT 'pending'
        )
    ''')
    
    # Books table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            publisher_id TEXT NOT NULL,
            title TEXT NOT NULL,
            author TEXT,
            year TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (publisher_id) REFERENCES publishers(id)
        )
    ''')
    
    # Magazines/Journals table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS magazines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            magazine_id TEXT NOT NULL,
            title TEXT NOT NULL,
            author TEXT,
            issue_number TEXT,
            issue_date TEXT,
            theme TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(magazine_id, title, issue_number)
        )
    ''')
    
    # Update schedule table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS update_schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scheduled_time TIME NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Update log table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS update_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            publisher_id TEXT,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT,
            items_count INTEGER DEFAULT 0,
            error_message TEXT
        )
    ''')
    
    # Insert default update times (5 times during "Flauten" - low usage times)
    # Typical low-usage times: early morning, mid-morning, early afternoon, late afternoon, evening
    default_times = [
        ("04:00", "Early morning update"),
        ("10:00", "Mid-morning update"),
        ("14:00", "Early afternoon update"),
        ("17:00", "Late afternoon update"),
        ("22:00", "Evening update")
    ]
    
    cursor.execute("SELECT COUNT(*) FROM update_schedule")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(
            "INSERT INTO update_schedule (scheduled_time, description) VALUES (?, ?)",
            default_times
        )
    
    conn.commit()
    conn.close()

# ============================================================================
# UPDATE LOGIC
# ============================================================================

def load_ernte_json():
    """Load data from ernte.json file."""
    ernte_path = DATA_DIR / "ernte.json"
    if ernte_path.exists():
        with open(ernte_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def check_and_trigger_update():
    """
    Check if an update is due and execute it.
    Called when the application starts or when a user accesses the site.
    Returns True if an update was performed, False otherwise.
    """
    now = datetime.now()
    current_time = now.time()
    today = now.date()
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Get all active scheduled times
    cursor.execute("SELECT id, scheduled_time FROM update_schedule WHERE is_active = 1")
    schedules = cursor.fetchall()
    
    update_performed = False
    
    for schedule in schedules:
        schedule_id = schedule[0]
        scheduled_time_str = schedule[1]
        scheduled_time = dt_time.fromisoformat(scheduled_time_str)
        
        # Check if this scheduled time has passed today and hasn't been executed
        # Use strftime to extract hour and minute for comparison
        cursor.execute("""
            SELECT id FROM update_log 
            WHERE DATE(executed_at) = ? 
            AND strftime('%H:%M', executed_at) BETWEEN ? AND ?
        """, (today.isoformat(), scheduled_time_str, scheduled_time_str[:2] + ":" + str(int(scheduled_time_str[3:5]) + 59).zfill(2)))
        
        already_executed = cursor.fetchone()
        
        if not already_executed and current_time >= scheduled_time:
            # Execute update for this time slot
            update_performed = perform_update(schedule_id, scheduled_time_str)
            break
    
    conn.close()
    return update_performed

def perform_update(schedule_id, scheduled_time_str):
    """
    Perform the actual update process.
    Loads new data from ernte.json and updates the database.
    Uses restrained volume to avoid overwhelming source websites.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        # Load current data from ernte.json
        ernte_data = load_ernte_json()
        
        total_items = 0
        
        for publisher_id, data in ernte_data.items():
            # Handle base publisher ID (remove :alt suffix for matching)
            base_id = publisher_id.split(':')[0]
            
            # Update publisher info
            cursor.execute("""
                INSERT OR REPLACE INTO publishers (id, name, country, type, source_type, last_update, update_status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                publisher_id,
                data.get('n', base_id),
                None,
                'verlag' if ':alt' not in publisher_id else 'backlist',
                data.get('q', 'unknown'),
                data.get('h', date.today().isoformat()),
                'updated'
            ))
            
            # Process books/titles
            titles = data.get('t', [])
            items_count = 0
            
            for title_data in titles:
                title = title_data.get('t', '')
                author = title_data.get('a', '')
                year = title_data.get('j', '')
                
                # For magazines, check if this is a journal entry
                if data.get('nr'):  # Has issue number, it's a magazine
                    cursor.execute("""
                        INSERT OR IGNORE INTO magazines 
                        (magazine_id, title, author, issue_number, issue_date, theme)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        base_id,
                        title,
                        author,
                        data.get('nr', ''),
                        data.get('d', ''),
                        data.get('th', '')
                    ))
                else:
                    # Regular book
                    cursor.execute("""
                        INSERT INTO books (publisher_id, title, author, year)
                        VALUES (?, ?, ?, ?)
                    """, (publisher_id, title, author, year))
                
                items_count += 1
            
            total_items += items_count
            
            # Log the update
            cursor.execute("""
                INSERT INTO update_log (publisher_id, status, items_count)
                VALUES (?, ?, ?)
            """, (publisher_id, 'success', items_count))
        
        conn.commit()
        
        # Log overall update
        cursor.execute("""
            INSERT INTO update_log (publisher_id, status, items_count)
            VALUES (?, ?, ?)
        """, ('_scheduled_' + str(schedule_id), 'scheduled_update_completed', total_items))
        conn.commit()
        
        print(f"Update completed at {datetime.now()}: {total_items} items processed")
        return True
        
    except Exception as e:
        conn.rollback()
        cursor.execute("""
            INSERT INTO update_log (publisher_id, status, error_message)
            VALUES (?, ?, ?)
        """, ('_scheduled_' + str(schedule_id), 'error', str(e)))
        conn.commit()
        print(f"Update failed at {datetime.now()}: {e}")
        return False
    finally:
        conn.close()

# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/')
def index():
    """Serve the main frontend page."""
    # Check for pending updates on page load
    check_and_trigger_update()
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/api/publishers')
def get_publishers():
    """Get list of all publishers."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM publishers ORDER BY name")
    publishers = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(publishers)

@app.route('/api/books')
def get_books():
    """Get books, optionally filtered by publisher."""
    publisher_id = request.args.get('publisher_id')
    conn = get_db()
    cursor = conn.cursor()
    
    if publisher_id:
        cursor.execute("SELECT * FROM books WHERE publisher_id = ? ORDER BY year DESC, title", (publisher_id,))
    else:
        cursor.execute("SELECT * FROM books ORDER BY created_at DESC LIMIT 100")
    
    books = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(books)

@app.route('/api/magazines')
def get_magazines():
    """Get magazines/journals."""
    magazine_id = request.args.get('magazine_id')
    conn = get_db()
    cursor = conn.cursor()
    
    if magazine_id:
        cursor.execute("SELECT * FROM magazines WHERE magazine_id = ? ORDER BY issue_date DESC", (magazine_id,))
    else:
        cursor.execute("SELECT DISTINCT magazine_id, title, issue_number, issue_date, theme FROM magazines ORDER BY issue_date DESC")
    
    magazines = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(magazines)

@app.route('/api/update-status')
def get_update_status():
    """Get the status of recent updates."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM update_log 
        ORDER BY executed_at DESC 
        LIMIT 50
    """)
    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(logs)

@app.route('/api/schedule')
def get_schedule():
    """Get the update schedule."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM update_schedule ORDER BY scheduled_time")
    schedules = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(schedules)

@app.route('/api/trigger-update', methods=['POST'])
def trigger_update():
    """Manually trigger an update."""
    success = perform_update(0, dt_time(datetime.now().time().hour, datetime.now().time().minute).isoformat())
    return jsonify({'success': success})

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    # Initialize database on startup
    init_db()
    
    # Check for pending updates on startup
    check_and_trigger_update()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
