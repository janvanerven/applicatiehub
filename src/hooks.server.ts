import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE, sessionCookieOptions, validateSession } from '$lib/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(SESSION_COOKIE);

  if (sessionId) {
    const { user, session, renewed } = validateSession(sessionId);
    event.locals.user = user;
    event.locals.session = session;

    // Sync the browser cookie's expiry when the DB session was silently renewed
    if (renewed && session) {
      event.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions(session.expiresAt, dev));
    }
  } else {
    event.locals.user = null;
    event.locals.session = null;
  }

  return resolve(event);
};
