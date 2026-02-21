import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { generateState, generateCodeVerifier } from 'arctic';
import { getAuthentikClient } from '$lib/auth/provider.server';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies }) => {
    const { client } = getAuthentikClient();

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const authUrl = client.createAuthorizationURL(state, codeVerifier, [
      'openid',
      'email',
      'profile'
    ]);

    const cookieOpts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: !dev,
      path: '/auth',
      maxAge: 600 // 10 minutes
    };

    cookies.set('oauth_state', state, cookieOpts);
    cookies.set('code_verifier', codeVerifier, cookieOpts);

    throw redirect(302, authUrl.toString());
  }
};
