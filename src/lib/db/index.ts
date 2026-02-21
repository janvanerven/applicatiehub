import { join } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
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

// Run pending migrations on every startup — drizzle tracks applied migrations
// in __drizzle_migrations and skips ones that have already run, so this is safe
// to call unconditionally. Throws on failure so the process does not start with
// a broken schema.
migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });
