import { randomUUID } from 'node:crypto';
import { eq, asc, desc, lt, gt } from 'drizzle-orm';
import { db } from '$lib/db';
import { menuItems, menuSettings } from './schema';
import type { MenuItem, MenuSettings, NewMenuItem, UpdateMenuItem } from './types';

export function getVisibleMenuItems(): MenuItem[] {
  return db
    .select()
    .from(menuItems)
    .where(eq(menuItems.visible, true))
    .orderBy(asc(menuItems.sortOrder))
    .all();
}

export function getAllMenuItems(): MenuItem[] {
  return db.select().from(menuItems).orderBy(asc(menuItems.sortOrder)).all();
}

export function getMenuItemById(id: string): MenuItem | null {
  return db.select().from(menuItems).where(eq(menuItems.id, id)).get() ?? null;
}

export function createMenuItem(data: NewMenuItem): MenuItem {
  const id = randomUUID();
  const result = db.insert(menuItems).values({ id, ...data }).run();
  if (result.changes !== 1) throw new Error('Failed to create menu item');
  return getMenuItemById(id)!;
}

export function updateMenuItem(id: string, data: UpdateMenuItem): MenuItem {
  const result = db.update(menuItems).set(data).where(eq(menuItems.id, id)).run();
  if (result.changes !== 1) throw new Error(`Menu item ${id} not found or update failed`);
  return getMenuItemById(id)!;
}

export function deleteMenuItem(id: string): void {
  const result = db.delete(menuItems).where(eq(menuItems.id, id)).run();
  if (result.changes !== 1) throw new Error(`Menu item ${id} not found`);
}

/** Move item one position up (lower sortOrder). No-op if already first. */
export function moveMenuItemUp(id: string): void {
  const item = getMenuItemById(id);
  if (!item) throw new Error(`Menu item ${id} not found`);

  const above = db
    .select()
    .from(menuItems)
    .where(lt(menuItems.sortOrder, item.sortOrder))
    .orderBy(desc(menuItems.sortOrder))
    .get();

  if (!above) return; // already at top

  db.transaction((tx) => {
    const r1 = tx
      .update(menuItems)
      .set({ sortOrder: above.sortOrder })
      .where(eq(menuItems.id, item.id))
      .run();
    const r2 = tx
      .update(menuItems)
      .set({ sortOrder: item.sortOrder })
      .where(eq(menuItems.id, above.id))
      .run();
    if (r1.changes !== 1 || r2.changes !== 1) throw new Error('Sort order swap failed');
  });
}

/** Move item one position down (higher sortOrder). No-op if already last. */
export function moveMenuItemDown(id: string): void {
  const item = getMenuItemById(id);
  if (!item) throw new Error(`Menu item ${id} not found`);

  const below = db
    .select()
    .from(menuItems)
    .where(gt(menuItems.sortOrder, item.sortOrder))
    .orderBy(asc(menuItems.sortOrder))
    .get();

  if (!below) return; // already at bottom

  db.transaction((tx) => {
    const r1 = tx
      .update(menuItems)
      .set({ sortOrder: below.sortOrder })
      .where(eq(menuItems.id, item.id))
      .run();
    const r2 = tx
      .update(menuItems)
      .set({ sortOrder: item.sortOrder })
      .where(eq(menuItems.id, below.id))
      .run();
    if (r1.changes !== 1 || r2.changes !== 1) throw new Error('Sort order swap failed');
  });
}

/** Read the showLoginLink setting. Defaults to false if not yet set. */
export function getMenuSettings(): MenuSettings {
  const row = db
    .select()
    .from(menuSettings)
    .where(eq(menuSettings.key, 'showLoginLink'))
    .get();
  return { showLoginLink: row?.value === 'true' };
}

/** Upsert menu settings. Returns the updated settings. */
export function updateMenuSettings(settings: Partial<MenuSettings>): MenuSettings {
  if (settings.showLoginLink !== undefined) {
    const value = settings.showLoginLink ? 'true' : 'false';
    const result = db
      .insert(menuSettings)
      .values({ key: 'showLoginLink', value })
      .onConflictDoUpdate({ target: menuSettings.key, set: { value } })
      .run();
    if (result.changes < 1) throw new Error('Failed to upsert menu settings');
  }
  return getMenuSettings();
}
