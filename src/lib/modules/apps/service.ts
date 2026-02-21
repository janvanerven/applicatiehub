import { randomUUID } from 'node:crypto';
import { eq, asc } from 'drizzle-orm';
import { db } from '$lib/db';
import { apps } from './schema';
import type { App, NewApp, UpdateApp } from './types';

export function getVisibleApps(): App[] {
  return db
    .select()
    .from(apps)
    .where(eq(apps.visible, true))
    .orderBy(asc(apps.sortOrder), asc(apps.createdAt))
    .all();
}

export function getAllApps(): App[] {
  return db.select().from(apps).orderBy(asc(apps.sortOrder), asc(apps.createdAt)).all();
}

export function getAppById(id: string): App | null {
  return db.select().from(apps).where(eq(apps.id, id)).get() ?? null;
}

export function createApp(data: NewApp): App {
  const id = randomUUID();
  const now = new Date();

  const result = db
    .insert(apps)
    .values({ id, ...data, createdAt: now, updatedAt: now })
    .run();

  if (result.changes !== 1) {
    throw new Error('Failed to create app');
  }

  return getAppById(id)!;
}

export function updateApp(id: string, data: UpdateApp): App {
  const result = db
    .update(apps)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(apps.id, id))
    .run();

  if (result.changes !== 1) {
    throw new Error(`App ${id} not found or update failed`);
  }

  return getAppById(id)!;
}

export function deleteApp(id: string): void {
  const result = db.delete(apps).where(eq(apps.id, id)).run();
  if (result.changes !== 1) {
    throw new Error(`App ${id} not found`);
  }
}
