export interface MenuItemFormValues {
  label: string;
  href: string;
  visible: boolean;
  isExternal: boolean;
}

export function parseMenuItemFormData(fd: FormData): MenuItemFormValues {
  return {
    label: fd.get('label')?.toString().trim() ?? '',
    href: fd.get('href')?.toString().trim() ?? '',
    visible: fd.get('visible') === 'on',
    isExternal: fd.get('isExternal') === 'on'
  };
}

export function validateMenuItemForm(values: MenuItemFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.label) errors.label = 'Label is verplicht.';
  else if (values.label.length > 100) errors.label = 'Label mag maximaal 100 tekens zijn.';

  if (!values.href) errors.href = 'URL is verplicht.';
  else if (!/^(https?:\/\/|\/(?!\/))/.test(values.href))
    errors.href = 'URL moet beginnen met / of https://. Protocol-relatieve URLs (//…) zijn niet toegestaan.';
  else if (values.href.length > 500) errors.href = 'URL mag maximaal 500 tekens zijn.';

  return errors;
}
