# PR: Empty States, Help Center, Deployment Pipeline, and Profile Settings

Closes #448 · Closes #439 · Closes #436 · Closes #438

---

## Summary

### #448 — Empty-state pages (Portfolio, History, Notifications)

- **SandboxContext**: Added `"notifications"` to `ModuleType` and default scenarios so the sandbox controls all four major pages.
- **SandboxClientPage**: Extended module labels, default state, and quick-action buttons to include Notifications.
- **Portfolio page** (`/dashboard/portfolio`): Replaced the static "Chart coming soon" placeholder with a full sandbox-driven state machine — `empty` (EmptyState + "Connect wallet" CTA), `loading` (skeleton), `timeout` (error + Retry), `partial-failure` (partial data + amber warning banner), and `success` (mock holdings table with allocation bars, stat cards).
- **Notifications page** (`/dashboard/notifications`): Restructured into a tabbed layout. New **Inbox** tab shows a notification list (unread indicators, mark-as-read actions) with `empty`, `loading`, and `partial-failure` states driven by SandboxContext. The original toast/banner **System Demo** tab is preserved in full.

All empty states follow the spec: 24–48 px icon in rounded container, `max-w-[420px]` body text, heading → body → CTA hierarchy, no layout shift when toggling sandbox scenarios.

---

### #439 — Help Center, FAQs, and Support Contact Flow

- **New page** `/dashboard/help` — three keyboard-accessible tabs:
  - **FAQs**: searchable + category-filtered accordion list (`FAQSection`). Accordions use `aria-expanded`, `aria-controls`, and keyboard Enter/Space handling for full screen-reader support.
  - **Transaction Help**: per-issue symptom / solution / prevention guide with severity badges (`TransactionGuidance`).
  - **Contact Support**: validated form with char counters on Subject and Message fields, async transaction ID lookup, error summary banner on submit, and a success state showing a generated reference ID and next-step guidance (`SupportForm`).
- **Route metadata**: `/dashboard/help` registered with `HelpCircle` icon in sidebar nav and command palette.

---

### #436 — Deployment Pipeline for Web Frontend

- **`deploy-staging.yml`**: Fixed — was using `npm` (project uses Yarn), incorrect `working-directory`, missing `yarn.lock` cache. Now uses `yarn install --frozen-lockfile`, adds `typecheck` + `lint` before build, passes `NODE_ENV=production` consistently.
- **`deploy-production.yml`**: Same fixes applied. Production deploys to Vercel with `--prod` flag on merge to `main`.
- **`Dockerfile`**: Multi-stage build (`deps → builder → runner`) using `node:20-alpine`. Non-root `nextjs` user for the runtime image. Build args for `NEXT_PUBLIC_APP_ENV` / `NEXT_PUBLIC_APP_URL`.
- **`docs/deployment.md`**: Expanded with env-var reference table, manual deploy commands, Docker usage, complete pre-release checklist, and step-by-step rollback instructions (Vercel Dashboard, git revert, Vercel CLI) with post-rollback verification checklist.

---

### #438 — User Profile and Account Settings

- **Settings page** (`/dashboard/settings`): Added a **Profile** section at the top with link-actions to `/profile` for "Display Name & Preferences", "Language & Region", and "Currency Display". Existing Wallet / Notifications / Security sections preserved with "Coming soon" badges.
- **Profile page** (`/profile`): Breadcrumb updated to link back to `/dashboard/settings` so navigation is bidirectional. The full profile form — display name, locale, timezone, currency format, sticky save/cancel row, inline field errors, summary error banner, success banner, localStorage persistence — was already complete and satisfies all spec requirements (24 px group spacing, inline + banner validation, save persists after refresh).

---

## Test Plan

- [ ] **Portfolio** — toggle Sandbox to each of the 5 scenarios; verify no layout shift and correct state renders; "Connect wallet" CTA navigates to `/dashboard`
- [ ] **Notifications** — switch Inbox ↔ System Demo tabs; toggle Sandbox empty/loading/partial-failure/success on Notifications module
- [ ] **History** — confirm existing sandbox scenarios (empty, loading, timeout, partial-failure) still work
- [ ] **Help › FAQs** — search, category filter, keyboard expand/collapse (Enter + Space), no-results state
- [ ] **Help › Transaction Help** — select an issue, expand Symptoms / Solutions / Prevention sections
- [ ] **Help › Contact Support** — submit with empty fields (error summary + inline errors); fix and submit (success state + reference ID); enter "404" in Transaction ID field (async validation error)
- [ ] **Staging deploy** — push to `dev` branch; confirm GitHub Actions → Deploy to Staging completes green
- [ ] **Profile** — edit display name → save → hard-refresh → value persists via localStorage
- [ ] **Settings → Profile** — links navigate to `/profile`; `/profile` breadcrumb links back to `/dashboard/settings`
