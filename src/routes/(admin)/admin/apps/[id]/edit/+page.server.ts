import { error, fail, redirect } from '@sveltejs/kit';
import { getAppById, updateApp, deleteApp, parseAppFormData, validateAppForm } from '$lib/modules/apps';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const app = getAppById(params.id);
  if (!app) throw error(404, 'Applicatie niet gevonden.');
  return { app };
};

export const actions: Actions = {
  update: async ({ params, request }) => {
    const values = parseAppFormData(await request.formData());
    const errors = validateAppForm(values);

    if (Object.keys(errors).length > 0) {
      return fail(422, { errors, values });
    }

    try {
      updateApp(params.id, values);
    } catch {
      return fail(500, {
        errors: { _form: 'Opslaan mislukt. Probeer het opnieuw.' } as Record<string, string>,
        values
      });
    }

    throw redirect(303, '/admin/apps');
  },

  delete: async ({ params }) => {
    try {
      deleteApp(params.id);
    } catch {
      return fail(404, {
        errors: { _form: 'Applicatie niet gevonden of al verwijderd.' } as Record<string, string>
      });
    }
    throw redirect(303, '/admin/apps');
  }
};
