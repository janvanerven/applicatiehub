import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const url = process.env.DATABASE_URL ?? './data/db.sqlite';

const sqlite = new Database(url);

// WAL mode: faster concurrent reads; foreign keys: enforce referential integrity
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
// Retry for up to 5 s on busy instead of immediately throwing SQLITE_BUSY
sqlite.pragma('busy_timeout = 5000');

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
