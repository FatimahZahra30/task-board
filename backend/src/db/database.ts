import Database from 'better-sqlite3';

const db: Database.Database = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    due_date TEXT,
    created_at TEXT NOT NULL
  )
`);

export default db;