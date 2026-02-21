import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.session) {
    throw redirect(302, '/auth/login');
  }

  // TypeScript narrows locals.user to User (non-null) after the throw above
  return {
    user: locals.user
  };
};
