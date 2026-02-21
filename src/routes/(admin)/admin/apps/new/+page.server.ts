import { fail, redirect } from '@sveltejs/kit';
import { createApp, parseAppFormData, validateAppForm } from '$lib/modules/apps';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const values = parseAppFormData(await request.formData());
    const errors = validateAppForm(values);

    if (Object.keys(errors).length > 0) {
      return fail(422, { errors, values });
    }

    try {
      createApp(values);
    } catch {
      return fail(500, {
        errors: { _form: 'Opslaan mislukt. Probeer het opnieuw.' } as Record<string, string>,
        values
      });
    }

    throw redirect(303, '/admin/apps');
  }
};
