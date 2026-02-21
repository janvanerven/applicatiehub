import { randomUUID } from 'node:crypto';
import { eq, asc, desc } from 'drizzle-orm';
import { db } from '$lib/db';
import { pages } from './schema';
import type { Page, NewPage, UpdatePage } from './types';

/** Convert a title to a URL-safe slug (pure function — no DB check). */
export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // strip diacritics
      .replace(/[^a-z0-9\s-]/g, '') // keep alphanumeric, spaces, hyphens
      .trim()
      .replace(/\s+/g, '-') // spaces → hyphens
      .replace(/-+/g, '-') // collapse multiple hyphens
      .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
      .slice(0, 80) || 'pagina'
  ); // fallback if title results in empty string
}

export function getPublishedPages(): Page[] {
  return db
    .select()
    .from(pages)
    .where(eq(pages.status, 'published'))
    .orderBy(asc(pages.title))
    .all();
}

export function getAllPages(): Page[] {
  return db.select().from(pages).orderBy(desc(pages.updatedAt)).all();
}

export function getPageBySlug(slug: string): Page | null {
  return db.select().from(pages).where(eq(pages.slug, slug)).get() ?? null;
}

export function getPageById(id: string): Page | null {
  return db.select().from(pages).where(eq(pages.id, id)).get() ?? null;
}

export function createPage(data: NewPage): Page {
  const id = randomUUID();
  const now = new Date();

  const result = db
    .insert(pages)
    .values({ id, ...data, createdAt: now, updatedAt: now })
    .run();

  if (result.changes !== 1) {
    throw new Error('Failed to create page');
  }

  return getPageById(id)!;
}

export function updatePage(id: string, data: UpdatePage): Page {
  const result = db
    .update(pages)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pages.id, id))
    .run();

  if (result.changes !== 1) {
    throw new Error(`Page ${id} not found or update failed`);
  }

  return getPageById(id)!;
}

export function deletePage(id: string): void {
  const result = db.delete(pages).where(eq(pages.id, id)).run();
  if (result.changes !== 1) {
    throw new Error(`Page ${id} not found`);
  }
}
