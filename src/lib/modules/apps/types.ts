// Re-export Drizzle-inferred types — single source of truth, stays in sync with schema.
import type { apps } from './schema';

export type App = typeof apps.$inferSelect;

/** Fields the caller must supply when creating an app. */
export type NewApp = Omit<typeof apps.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

/** All NewApp fields are optional when updating. */
export type UpdateApp = Partial<NewApp>;
