import { getVisibleApps } from '$lib/modules/apps';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  try {
    return { apps: getVisibleApps() };
  } catch (err) {
    console.error('[landing] Failed to load apps:', err);
    return { apps: [] };
  }
};
