/** Parsed, normalised values from the app management form. */
export interface AppFormValues {
  name: string;
  description: string;
  linkUrl: string;
  iconPath: string | null;
  isExternal: boolean;
  visible: boolean;
  sortOrder: number;
}

/** Extract and normalise form data — no DB calls, pure transformation. */
export function parseAppFormData(fd: FormData): AppFormValues {
  const rawSortOrder = fd.get('sortOrder')?.toString().trim() ?? '';
  return {
    name: fd.get('name')?.toString().trim() ?? '',
    description: fd.get('description')?.toString().trim() ?? '',
    linkUrl: fd.get('linkUrl')?.toString().trim() ?? '',
    iconPath: fd.get('iconPath')?.toString().trim() || null,
    isExternal: fd.get('isExternal') === 'on',
    visible: fd.get('visible') === 'on',
    // Default to 0 for empty field; non-numeric values become NaN (caught by validate)
    sortOrder: rawSortOrder === '' ? 0 : Number(rawSortOrder)
  };
}

/** Validate parsed app form values; returns a map of field → error message. */
export function validateAppForm(values: AppFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.name) errors.name = 'Naam is verplicht.';
  else if (values.name.length > 100) errors.name = 'Naam mag maximaal 100 tekens bevatten.';

  if (!values.description) errors.description = 'Omschrijving is verplicht.';
  else if (values.description.length > 500)
    errors.description = 'Omschrijving mag maximaal 500 tekens bevatten.';

  // Only allow safe URL prefixes to prevent javascript: URI injection
  if (!values.linkUrl) {
    errors.linkUrl = 'URL is verplicht.';
  } else if (!/^(https?:\/\/|\/)/.test(values.linkUrl)) {
    errors.linkUrl = 'URL moet beginnen met https://, http:// of /.';
  }

  // Only allow empty, an upload path, or an absolute https/http URL for icons
  if (values.iconPath && !/^(https?:\/\/|\/uploads\/)/.test(values.iconPath)) {
    errors.iconPath =
      'Pictogram moet een externe URL (https://…) of een upload-pad (/uploads/…) zijn.';
  }

  if (!Number.isInteger(values.sortOrder) || values.sortOrder < 0) {
    errors.sortOrder = 'Volgorde moet een positief geheel getal zijn.';
  }

  return errors;
}
