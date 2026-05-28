NeuroWealth — Frontend
=================================

This repository contains the Next.js frontend for NeuroWealth. It's a demo-ready frontend with mock authentication, UI components, and client-side adapters that let the app run without a backend.

Quick start
-----------

Requirements: Node.js 20+, Yarn (Corepack supported)

Install and run:

```bash
yarn install
yarn dev
```

Run tests:

```bash
yarn test
```

What this repo contains
-----------------------
- Next.js 14 app under `src/app`
- Client-side mock auth (`src/lib/mock-auth.ts`) that persists an in-browser session in `localStorage` and mirrors it to a non-httpOnly cookie so `middleware.ts` can perform edge-side redirects.
- Edge middleware (`middleware.ts`) that protects routes under `/dashboard`, `/profile`, and `/settings` and redirects unauthenticated users to `/login?from=...`.
- Tests using the Node test runner (match: `src/**/*.test.ts`).

Auth syncing note
-----------------
The mock auth flow stores the session in `localStorage` using `SESSION_STORAGE_KEY` and mirrors it into a cookie named `SESSION_COOKIE_NAME`. This allows the browser UI and Next.js middleware to agree on authentication state in demo setups. See `src/lib/auth-constants.ts` for the canonical values.

Contributing
------------
- Follow existing patterns for components and hooks.
- Tests live next to logic under `src/` and run via `yarn test`.

License
-------
Internal/demo project — see repository owner for license details.
