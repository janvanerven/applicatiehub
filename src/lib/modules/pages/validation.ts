import { generateSlug } from './service';

export interface PageFormValues {
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  showInMenu: boolean;
  metaDescription: string | null;
}

export function parsePageFormData(fd: FormData): PageFormValues {
  const title = fd.get('title')?.toString().trim() ?? '';
  const rawSlug = fd
    .get('slug')
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
  return {
    title,
    slug: rawSlug || generateSlug(title),
    content: fd.get('content')?.toString() ?? '',
    status: fd.get('status') === 'published' ? 'published' : 'draft',
    showInMenu: fd.get('showInMenu') === 'on',
    metaDescription: fd.get('metaDescription')?.toString().trim() || null
  };
}

export function validatePageForm(values: PageFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.title) errors.title = 'Titel is verplicht.';
  else if (values.title.length > 200) errors.title = 'Titel mag maximaal 200 tekens zijn.';

  if (!values.slug) errors.slug = 'Slug is verplicht.';
  else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(values.slug) && !/^[a-z0-9]$/.test(values.slug))
    errors.slug = 'Slug mag alleen kleine letters, cijfers en koppeltekens bevatten, en mag niet beginnen of eindigen met een koppelteken.';
  else if (values.slug.length > 100) errors.slug = 'Slug mag maximaal 100 tekens zijn.';

  if (values.content.length > 100_000)
    errors.content = 'Inhoud mag maximaal 100.000 tekens zijn.';

  if (values.metaDescription && values.metaDescription.length > 300)
    errors.metaDescription = 'Meta-beschrijving mag maximaal 300 tekens zijn.';

  return errors;
}
