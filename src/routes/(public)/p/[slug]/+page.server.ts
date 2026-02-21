import { error } from '@sveltejs/kit';
import { getPageBySlug } from '$lib/modules/pages';
import { renderMarkdown } from '$lib/utils/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const page = getPageBySlug(params.slug.toLowerCase());

  if (!page || page.status !== 'published') {
    throw error(404, 'Pagina niet gevonden.');
  }

  return {
    page,
    html: renderMarkdown(page.content)
  };
};
