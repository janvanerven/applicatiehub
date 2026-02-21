import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const menuItems = sqliteTable('menu_items', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  href: text('href').notNull(),
  visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  isExternal: integer('is_external', { mode: 'boolean' }).notNull().default(false)
});

/** Single-row settings table for menu behaviour flags */
export const menuSettings = sqliteTable('menu_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull()
});
