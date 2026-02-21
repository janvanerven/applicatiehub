# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Applicatie Hub** is a lightweight, self-hosted CMS and application hub website. It displays a gallery of apps on a landing page, supports CMS-managed pages with Markdown, and is administered by a single OAuth-authenticated admin role backed by [Authentik](https://goauthentik.io/).

The site is designed to be publicly exposed, Docker-hosted, and grow modularly into a broader platform over time.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | SvelteKit (SSR, full-stack) |
| Database | SQLite + Drizzle ORM |
| Auth | Arctic (OAuth2/OIDC client) + Lucia (session management) |
| Styling | TailwindCSS (tree/nature theme, dark mode via `class` strategy) |
| Markdown | `marked` + `highlight.js` |
| Image storage | Local filesystem (`./uploads/`, Docker volume) |
| Testing | Vitest + `@testing-library/svelte` |
| Container | Docker multi-stage build (node:20-alpine) |

## Commands

```bash
# Development
npm run dev               # Start dev server (http://localhost:5173)
npm run build             # Production build
npm run preview           # Preview production build locally

# Code quality
npm run check             # Svelte type checking (svelte-check)
npm run lint              # ESLint + Prettier check
npm run format            # Auto-format with Prettier

# Testing
npm run test              # Run all Vitest tests
npm run test -- --run src/lib/modules/pages  # Run tests for a specific module

# Database
npm run db:generate       # Generate Drizzle migration from schema changes
npm run db:migrate        # Apply pending migrations
npm run db:studio         # Open Drizzle Studio (local DB browser)

# Docker
docker build -t applicatiehub .
docker compose up -d      # Start with docker-compose.yml
docker compose logs -f    # Follow logs
```

## Project Structure

```
src/
├── lib/
│   ├── db/               # Drizzle client, schema index, migration runner
│   ├── auth/             # OAuth2 flow (Arctic), session management (Lucia), SvelteKit hook helpers
│   └── modules/          # Feature modules — one folder per domain
│       ├── apps/         # App gallery: schema, service, types
│       ├── pages/        # CMS pages: schema, service, types (draft/publish, slugs, markdown)
│       ├── menu/         # Menu configuration: schema, service, types
│       └── media/        # Image upload and serving: service, types
├── routes/
│   ├── (public)/         # Public-facing: landing, app detail, CMS pages, login
│   ├── (admin)/          # Admin panel (auth-guarded): pages, apps, menu, media managers
│   └── api/              # Server-only API routes (OAuth callbacks, file upload)
└── components/           # Shared Svelte components

data/                     # SQLite database file (Docker volume mount)
uploads/                  # User-uploaded images (Docker volume mount)
static/                   # Static assets (favicon, fonts)
```

## Module Conventions

Each module under `src/lib/modules/<name>/` follows this layout:
```
<name>/
├── schema.ts     # Drizzle table definitions for this domain
├── service.ts    # All DB operations (no raw SQL in routes)
├── types.ts      # Shared TypeScript types/interfaces
└── index.ts      # Re-exports
```

Routes and components import from the module's `index.ts` only — never directly from `schema.ts` or `service.ts` from outside the module.

## Authentication & Authorization

- Auth is enforced **server-side only** in `src/hooks.server.ts` via SvelteKit's `handle` function.
- Never rely on client-side checks for protecting admin routes.
- All `(admin)` route group pages/server files are protected by the hook.
- Only one role exists: **Administrator**. User management happens in Authentik, not in this app.
- Session data is stored in SQLite (Lucia sessions table).
- See `AuthSetup.md` for Authentik OIDC application setup instructions.

## Docker & Deployment

- The app listens on **port 3000** internally. The reverse proxy handles port 80.
- The `ORIGIN` environment variable **must** be set (e.g., `https://hub.example.com`) for SvelteKit CSRF protection to work correctly.
- Two directories must be mounted as Docker volumes to persist data across restarts:
  - `./data:/app/data` — SQLite database
  - `./uploads:/app/uploads` — uploaded images
- Image upload paths are resolved relative to the `uploads/` volume, using absolute paths via `process.cwd()` — this ensures compatibility on Linux/Docker.

### Required environment variables

```env
ORIGIN=https://your-domain.com
AUTHENTIK_CLIENT_ID=...
AUTHENTIK_CLIENT_SECRET=...
AUTHENTIK_ISSUER_URL=https://authentik.your-domain.com/application/o/<slug>/
DATABASE_URL=./data/db.sqlite
UPLOAD_DIR=./uploads
```

## Living Documentation (Gitignored)

The following files are excluded from git and serve as internal engineering documents:

- `Architecture.md` — Architecture Decision Records (ADRs), infrastructure diagrams, technical rationale
- `FunctionalDesign.md` — Functional specifications, user flows, feature definitions

Update these files as decisions are made. They are gitignored intentionally.

## Engineering Workflow

- **Module-by-module delivery**: Fully implement and verify one module before starting the next.
- **Code smell review**: After completing each module, launch a `general-purpose` agent with the prompt: _"Review the code in `src/lib/modules/<name>/` and `src/routes/` for code smells, security issues, and deviations from the project conventions in CLAUDE.md. Be critical."_ Address findings before moving on.
- **Security baseline**: All user input is validated server-side. File uploads are validated by MIME type and size. SQL is always parameterized (Drizzle handles this).
