import { redirect, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { OAuth2RequestError, ArcticFetchError, decodeIdToken } from 'arctic';
import { getAuthentikClient } from '$lib/auth/provider.server';
import { db } from '$lib/db';
import { users } from '$lib/db/core';
import { SESSION_COOKIE, sessionCookieOptions, createSession } from '$lib/auth/session';
import type { RequestHandler } from './$types';

const MAX_STATE_LENGTH = 256;

export const GET: RequestHandler = async ({ url, cookies }) => {
  // Discard any provider-side error without reflecting the value into the response
  if (url.searchParams.has('error')) {
    throw error(400, 'Authenticatie mislukt. Probeer opnieuw in te loggen.');
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('oauth_state');
  const codeVerifier = cookies.get('code_verifier');

  // Validate state length before comparison to avoid processing abnormally large values
  if (
    !code ||
    !state ||
    state.length > MAX_STATE_LENGTH ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    throw error(400, 'Ongeldige OAuth-state. Probeer opnieuw in te loggen.');
  }

  // Consume the one-time OAuth cookies immediately
  cookies.delete('oauth_state', { path: '/auth' });
  cookies.delete('code_verifier', { path: '/auth' });

  const { client, issuerUrl, clientId } = getAuthentikClient();

  let tokens;
  try {
    tokens = await client.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      console.error('[callback] OAuth2RequestError:', e.message, e.description);
      throw error(400, `OAuth-fout: ${e.message}`);
    }
    if (e instanceof ArcticFetchError) {
      console.error('[callback] ArcticFetchError — cannot reach IdP:', e.message, e.cause);
      throw error(502, 'Kan de identity provider niet bereiken.');
    }
    console.error('[callback] Unexpected error during token exchange:', e);
    throw e;
  }

  // decodeIdToken only base64-decodes the payload; the token came from a direct
  // TLS-protected back-channel call so we additionally validate key claims.
  const payload = decodeIdToken(tokens.idToken()) as Record<string, unknown>;

  // Validate issuer, audience, and expiry claims
  // Normalize both sides — Authentik includes a trailing slash in the iss claim
  // but the configured AUTHENTIK_ISSUER_URL may or may not have one.
  const normalize = (u: string) => u.replace(/\/$/, '');
  // TEMP DEBUG — remove after diagnosing
  console.error('[callback] iss claim  :', payload.iss);
  console.error('[callback] issuerUrl  :', issuerUrl);
  console.error('[callback] aud claim  :', payload.aud);
  console.error('[callback] clientId   :', clientId);
  console.error('[callback] exp        :', payload.exp, '| now:', Math.floor(Date.now() / 1000));
  if (typeof payload.iss !== 'string' || normalize(payload.iss) !== normalize(issuerUrl)) {
    throw error(502, 'Token verificatie mislukt: onverwachte issuer.');
  }
  const aud = payload.aud;
  if (aud !== clientId && !(Array.isArray(aud) && aud.includes(clientId))) {
    throw error(502, 'Token verificatie mislukt: onverwachte audience.');
  }
  const exp = typeof payload.exp === 'number' ? payload.exp : null;
  if (!exp || Date.now() / 1000 > exp) {
    throw error(502, 'Token is verlopen.');
  }

  const userId = typeof payload.sub === 'string' ? payload.sub : null;
  const email = typeof payload.email === 'string' ? payload.email : null;
  const name =
    typeof payload.name === 'string'
      ? payload.name
      : typeof payload.preferred_username === 'string'
        ? payload.preferred_username
        : email;

  if (!userId || !email || !name) {
    throw error(502, 'Identity provider stuurde onvolledige gebruikersdata.');
  }

  // Upsert user — keeps email/name in sync with Authentik on every login.
  // createdAt in values() is discarded on conflict; changes is 1 for both insert and update.
  const upsertResult = db
    .insert(users)
    .values({ id: userId, email, name, createdAt: new Date() })
    .onConflictDoUpdate({ target: users.id, set: { email, name } })
    .run();

  if (upsertResult.changes < 1) {
    throw error(500, 'Gebruikersrecord kon niet worden aangemaakt of bijgewerkt.');
  }

  const session = createSession(userId);
  cookies.set(SESSION_COOKIE, session.id, sessionCookieOptions(session.expiresAt, dev));

  throw redirect(302, '/admin');
};
