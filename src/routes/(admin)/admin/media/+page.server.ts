import { fail, redirect } from '@sveltejs/kit';
import { saveUpload, deleteUpload, listUploads, UploadError } from '$lib/modules/media';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const uploads = await listUploads(url.origin);
  return { uploads };
};

export const actions: Actions = {
  upload: async ({ request, url }) => {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return fail(400, { error: 'Geen bestand geselecteerd.', uploaded: null });
    }

    try {
      const { absolutePath: _, ...uploaded } = await saveUpload(file, url.origin);
      return { error: null, uploaded };
    } catch (err) {
      if (err instanceof UploadError) {
        return fail(400, { error: err.message, uploaded: null });
      }
      console.error('[media] Unexpected upload error:', err);
      return fail(500, { error: 'Upload mislukt. Probeer het opnieuw.', uploaded: null });
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const filename = formData.get('filename')?.toString().trim();

    if (!filename) {
      return fail(400, { error: 'Geen bestandsnaam opgegeven.', uploaded: null });
    }

    try {
      await deleteUpload(filename);
    } catch (err) {
      if (err instanceof UploadError) {
        return fail(400, { error: err.message, uploaded: null });
      }
      console.error('[media] Unexpected delete error:', err);
      return fail(500, { error: 'Verwijderen mislukt. Probeer het opnieuw.', uploaded: null });
    }

    throw redirect(303, '/admin/media');
  }
};
