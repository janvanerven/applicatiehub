import { fail, redirect } from '@sveltejs/kit';
import { getAllApps, deleteApp } from '$lib/modules/apps';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return { apps: getAllApps() };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString().trim();

    if (!id) {
      return fail(400, { error: 'Geen app-ID opgegeven.' });
    }

    try {
      deleteApp(id);
    } catch {
      return fail(404, { error: 'Applicatie niet gevonden of al verwijderd.' });
    }

    throw redirect(303, '/admin/apps');
  }
};
