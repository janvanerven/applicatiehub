import type { menuItems } from './schema';

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = Omit<typeof menuItems.$inferInsert, 'id'>;
export type UpdateMenuItem = Partial<NewMenuItem>;

/** Key-value settings for menu behaviour */
export interface MenuSettings {
  showLoginLink: boolean;
}
