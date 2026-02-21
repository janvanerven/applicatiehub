import { getVisibleMenuItems, getMenuSettings } from '$lib/modules/menu';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
  try {
    return {
      menuItems: getVisibleMenuItems(),
      menuSettings: getMenuSettings()
    };
  } catch (err) {
    console.error('[layout] Failed to load menu:', err);
    return { menuItems: [], menuSettings: { showLoginLink: false } };
  }
};
