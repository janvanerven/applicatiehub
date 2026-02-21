import { fail, redirect } from '@sveltejs/kit';
import { getAllPages, deletePage } from '$lib/modules/pages';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return { pages: getAllPages() };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString().trim();

    if (!id) {
      return fail(400, { error: 'Geen pagina-ID opgegeven.' });
    }

    try {
      deletePage(id);
    } catch {
      return fail(404, { error: 'Pagina niet gevonden of al verwijderd.' });
    }

    throw redirect(303, '/admin/pages');
  }
};
