import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getAllApps } from '$lib/modules/apps';
import { getAllPages } from '$lib/modules/pages';
import { getAllMenuItems } from '$lib/modules/menu';
import { SAFE_FILENAME_RE } from '$lib/modules/media';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  const apps = getAllApps();
  const allPages = getAllPages();
  const menuItems = getAllMenuItems();

  const uploadsDir = join(process.cwd(), 'uploads');
  const mediaCount = existsSync(uploadsDir)
    ? readdirSync(uploadsDir).filter((f) => SAFE_FILENAME_RE.test(f)).length
    : 0;

  return {
    stats: {
      apps: apps.length,
      pagesPublished: allPages.filter((p) => p.status === 'published').length,
      pagesDraft: allPages.filter((p) => p.status === 'draft').length,
      menuItems: menuItems.length,
      media: mediaCount
    }
  };
};
