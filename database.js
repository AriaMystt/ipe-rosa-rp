import Database from 'better-sqlite3';
const db = new Database('fichas.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS fichas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL UNIQUE,
    charName TEXT NOT NULL,
    age TEXT,
    ethnicity TEXT,
    year TEXT,
    connections TEXT,
    lore TEXT,
    type TEXT,
    personality TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
  )
`);

const columns = db.prepare(`PRAGMA table_info(fichas)`).all();
const hasStatus = columns.some((col) => col.name === 'status');
if (!hasStatus) {
  db.exec(`ALTER TABLE fichas ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'`);
}

export default db;