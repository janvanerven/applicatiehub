import { fail, redirect } from '@sveltejs/kit';
import {
  createPage,
  getPageBySlug,
  parsePageFormData,
  validatePageForm
} from '$lib/modules/pages';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const values = parsePageFormData(await request.formData());
    const errors = validatePageForm(values);

    if (!errors.slug) {
      const conflict = getPageBySlug(values.slug);
      if (conflict) {
        errors.slug = `Deze slug is al in gebruik door "${conflict.title}". Kies een andere slug.`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return fail(422, { errors, values });
    }

    try {
      createPage(values);
    } catch {
      return fail(500, {
        errors: { _form: 'Opslaan mislukt. Probeer het opnieuw.' } as Record<string, string>,
        values
      });
    }

    throw redirect(303, '/admin/pages');
  }
};
