import Database from 'better-sqlite3';

const db = new Database('pm-maps.db');

// Create the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pm_name TEXT,
    address TEXT,
    latitude REAL,
    longitude REAL,
    comment TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TZIMESTAMP
  )
`);

export default db;