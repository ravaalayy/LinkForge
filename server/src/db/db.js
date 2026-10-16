import Database from 'better-sqlite3';
import path from 'path';

// Menyimpan database di folder server/
const dbPath = path.resolve(process.cwd(), 'linkforge.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL'); // Meningkatkan performa SQLite

// Membuat tabel jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL,
    alias TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;