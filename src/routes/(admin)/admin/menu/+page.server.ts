import { fail, redirect } from '@sveltejs/kit';
import {
  getAllMenuItems,
  getMenuSettings,
  createMenuItem,
  deleteMenuItem,
  moveMenuItemUp,
  moveMenuItemDown,
  updateMenuSettings,
  parseMenuItemFormData,
  validateMenuItemForm
} from '$lib/modules/menu';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    items: getAllMenuItems(),
    settings: getMenuSettings()
  };
};

export const actions: Actions = {
  add: async ({ request }) => {
    const formData = await request.formData();
    const values = parseMenuItemFormData(formData);
    const errors = validateMenuItemForm(values);

    if (Object.keys(errors).length > 0) {
      return fail(422, { addErrors: errors, addValues: values });
    }

    const existing = getAllMenuItems();
    const nextSort = existing.length > 0 ? Math.max(...existing.map((i) => i.sortOrder)) + 10 : 0;

    try {
      createMenuItem({ ...values, sortOrder: nextSort });
    } catch {
      return fail(500, {
        addErrors: { _form: 'Opslaan mislukt. Probeer het opnieuw.' } as Record<string, string>,
        addValues: values
      });
    }

    throw redirect(303, '/admin/menu');
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString().trim();

    if (!id) return fail(400, { error: 'Geen item-ID opgegeven.' });

    try {
      deleteMenuItem(id);
    } catch {
      return fail(404, { error: 'Menu-item niet gevonden of al verwijderd.' });
    }

    throw redirect(303, '/admin/menu');
  },

  moveUp: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString().trim();
    if (!id) return fail(400, { error: 'Geen item-ID opgegeven.' });
    try {
      moveMenuItemUp(id);
    } catch {
      return fail(500, { error: 'Volgorde bijwerken mislukt.' });
    }
    throw redirect(303, '/admin/menu');
  },

  moveDown: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString().trim();
    if (!id) return fail(400, { error: 'Geen item-ID opgegeven.' });
    try {
      moveMenuItemDown(id);
    } catch {
      return fail(500, { error: 'Volgorde bijwerken mislukt.' });
    }
    throw redirect(303, '/admin/menu');
  },

  settings: async ({ request }) => {
    const formData = await request.formData();
    const showLoginLink = formData.get('showLoginLink') === 'on';
    try {
      updateMenuSettings({ showLoginLink });
    } catch {
      return fail(500, { error: 'Instellingen opslaan mislukt.' });
    }
    throw redirect(303, '/admin/menu');
  }
};
