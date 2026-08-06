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
    personality TEXT
  )
`);

export default db;