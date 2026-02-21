import { error } from '@sveltejs/kit';
import { Authentik } from 'arctic';
import { env } from '$env/dynamic/private';

export interface AuthentikConfig {
  client: Authentik;
  /** Issuer URL without trailing slash, for ID-token `iss` claim validation */
  issuerUrl: string;
  clientId: string;
}

/**
 * Constructs the Authentik OAuth2 client from environment variables.
 * Throws a 500 error if any required variable is missing so callers do
 * not have to repeat the guard.
 */
export function getAuthentikClient(): AuthentikConfig {
  const { AUTHENTIK_ISSUER_URL, AUTHENTIK_CLIENT_ID, AUTHENTIK_CLIENT_SECRET, ORIGIN } = env;

  if (!AUTHENTIK_ISSUER_URL || !AUTHENTIK_CLIENT_ID || !AUTHENTIK_CLIENT_SECRET || !ORIGIN) {
    throw error(500, 'OAuth-configuratie ontbreekt op de server.');
  }

  const domain = new URL(AUTHENTIK_ISSUER_URL).hostname;
  const client = new Authentik(
    domain,
    AUTHENTIK_CLIENT_ID,
    AUTHENTIK_CLIENT_SECRET,
    `${ORIGIN}/auth/callback`
  );

  return {
    client,
    issuerUrl: AUTHENTIK_ISSUER_URL.replace(/\/$/, ''),
    clientId: AUTHENTIK_CLIENT_ID
  };
}
