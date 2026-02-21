import { error, fail, redirect } from '@sveltejs/kit';
import {
  getPageById,
  getPageBySlug,
  updatePage,
  deletePage,
  parsePageFormData,
  validatePageForm
} from '$lib/modules/pages';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const page = getPageById(params.id);
  if (!page) throw error(404, 'Pagina niet gevonden.');
  return { page };
};

export const actions: Actions = {
  update: async ({ params, request }) => {
    const values = parsePageFormData(await request.formData());
    const errors = validatePageForm(values);

    if (!errors.slug) {
      const conflict = getPageBySlug(values.slug);
      if (conflict && conflict.id !== params.id) {
        errors.slug = `Deze slug is al in gebruik door "${conflict.title}". Kies een andere slug.`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return fail(422, { errors, values });
    }

    try {
      updatePage(params.id, values);
    } catch {
      return fail(500, {
        errors: { _form: 'Opslaan mislukt. Probeer het opnieuw.' } as Record<string, string>,
        values
      });
    }

    throw redirect(303, '/admin/pages');
  },

  delete: async ({ params }) => {
    try {
      deletePage(params.id);
    } catch {
      return fail(404, {
        errors: { _form: 'Pagina niet gevonden of al verwijderd.' } as Record<string, string>
      });
    }
    throw redirect(303, '/admin/pages');
  }
};
