// Core schema — auth tables
export * from './core';

// Module schemas — use relative paths (drizzle-kit does not resolve $lib aliases)
export * from '../modules/apps/schema';
export * from '../modules/pages/schema';
export * from '../modules/menu/schema';
