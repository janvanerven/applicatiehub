import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE, invalidateSession } from '$lib/auth/session';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  const sessionId = cookies.get(SESSION_COOKIE);
  if (sessionId) {
    invalidateSession(sessionId);
    cookies.delete(SESSION_COOKIE, { path: '/' });
  }
  throw redirect(302, '/');
};
