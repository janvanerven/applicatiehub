import type { pages } from './schema';

export type Page = typeof pages.$inferSelect;
export type NewPage = Omit<typeof pages.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePage = Partial<NewPage>;
export type PageStatus = 'draft' | 'published';
