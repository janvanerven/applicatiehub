// Re-export Drizzle-inferred types so there is a single source of truth.
// Defining them manually here would silently diverge when columns are added.
import type { User, Session } from '../db/core';

export type { User, Session };

export interface SessionValidationResult {
  user: User | null;
  session: Session | null;
}
