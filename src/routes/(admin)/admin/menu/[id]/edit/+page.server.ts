import { error, fail, redirect } from '@sveltejs/kit';
import {
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  parseMenuItemFormData,
  validateMenuItemForm
} from '$lib/modules/menu';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const item = getMenuItemById(params.id);
  if (!item) throw error(404, 'Menu-item niet gevonden.');
  return { item };
};

export const actions: Actions = {
  update: async ({ params, request }) => {
    const values = parseMenuItemFormData(await request.formData());
    const errors = validateMenuItemForm(values);

    if (Object.keys(errors).length > 0) {
      return fail(422, { errors, values });
    }

    try {
      updateMenuItem(params.id, values);
    } catch {
      return fail(500, {
        errors: { _form: 'Opslaan mislukt. Probeer het opnieuw.' } as Record<string, string>,
        values
      });
    }

    throw redirect(303, '/admin/menu');
  },

  delete: async ({ params }) => {
    try {
      deleteMenuItem(params.id);
    } catch {
      return fail(404, {
        errors: {
          _form: 'Menu-item niet gevonden of al verwijderd.'
        } as Record<string, string>
      });
    }
    throw redirect(303, '/admin/menu');
  }
};
