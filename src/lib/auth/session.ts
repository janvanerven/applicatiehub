import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db';
import { sessions, users } from '$lib/db/core';
import type { SessionValidationResult } from './types';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_RENEW_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000; // renew if < 15 days remain

/** Cookie name — import from here in both hooks and the OAuth callback for consistency */
export const SESSION_COOKIE = 'session';

export function sessionCookieOptions(expiresAt: Date, isDev: boolean) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: !isDev,
    path: '/',
    expires: expiresAt
  };
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function createSession(userId: string): { id: string; expiresAt: Date } {
  const id = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  const result = db
    .insert(sessions)
    .values({ id, userId, expiresAt, createdAt: now })
    .run();

  if (result.changes !== 1) {
    throw new Error('Failed to create session');
  }

  return { id, expiresAt };
}

export function validateSession(
  sessionId: string
): SessionValidationResult & { renewed: boolean } {
  const row = db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .get();

  if (!row) {
    return { user: null, session: null, renewed: false };
  }

  const { user, session } = row;

  if (session.expiresAt < new Date()) {
    db.delete(sessions).where(eq(sessions.id, sessionId)).run();
    return { user: null, session: null, renewed: false };
  }

  const timeRemaining = session.expiresAt.getTime() - Date.now();
  if (timeRemaining < SESSION_RENEW_THRESHOLD_MS) {
    const newExpiry = new Date(Date.now() + SESSION_TTL_MS);
    db.update(sessions).set({ expiresAt: newExpiry }).where(eq(sessions.id, sessionId)).run();
    // Return a fresh object — never mutate the Drizzle row in-place
    return { user, session: { ...session, expiresAt: newExpiry }, renewed: true };
  }

  return { user, session, renewed: false };
}

export function invalidateSession(sessionId: string): void {
  db.delete(sessions).where(eq(sessions.id, sessionId)).run();
}
