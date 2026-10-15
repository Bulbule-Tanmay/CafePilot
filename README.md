# CafePilot

India-first, multivendor restaurant management and QR-ordering SaaS. One vendor owns one restaurant. A separate super-admin dashboard handles platform governance and support.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Supabase (Postgres, Auth, RLS, Storage, Realtime, Edge Functions)

> Status: **Stage 0 complete** (foundation + route shells). Everything else is planned, not built. See [Stages](#stages).

The full architecture, schema, state machines and acceptance gates live in [`docs/implementation-plan.md`](docs/implementation-plan.md). This README is the working summary.

---

## Product flow

1. Restaurant configures profile, floor, menu, taxes, staff, payment instructions.
2. Guest scans a table or virtual-location QR.
3. Guest browses live menu, builds basket, enters name + mobile, optional coupon, places order.
4. Restaurant sees order in Live Orders and Kitchen.
5. Kitchen/service actions advance one canonical order state.
6. Guest sees changes in realtime.
7. Staff settle bill, free table, generate GST-ready invoice.
8. Dashboard, reports, guests, loyalty, audit reflect the transaction.

## Confirmed decisions

- Multivendor, one vendor = one restaurant. Self-signup → email verify → business submission → CafePilot admin approval.
- Platform admin: governance/support only. No silent impersonation, no arbitrary financial edits.
- Guest checkout without account. Staff/admin use Supabase Auth.
- Payments are **recorded**, not processed. Manual UPI UTR confirmation. Gateway abstraction reserved.
- Realtime in-app updates first. Push/SMS/WhatsApp/email deferred.
- No wallet, commission, subscriptions, top-ups. No unverified pricing claims.
- English UI, INR (integer paise), Asia/Kolkata, Indian phone formats, configurable GST/HSN, fiscal-year invoice sequencing.
- Server-authoritative: order submit, status transitions, settlement, invoice numbers, refunds, loyalty, coupons, games, reset. Never trust client for IDs, roles, prices, tax, totals, payment status.

## Route map

```text
/                          Public marketing
/auth/*  /onboarding  /approval-status
/platform/*                CafePilot super-admin
/app/*                     Restaurant dashboard, billing, kitchen, config
/g/:restaurantSlug/*       Guest ordering (mobile-first)
```

Full route list in the plan doc, section 4.

## Stages

Each stage is built, verified, and reported before the next starts.

| # | Stage | Status |
|---|-------|--------|
| 0 | Foundation: tooling, design tokens, route shells, Supabase client, money/date utils, error states | ✅ Done |
| 1 | Tenancy, auth, onboarding, platform admin, RLS | ⬜ Planned |
| 2 | Restaurant profile, floor, staff, settings, QR endpoints | ⬜ Planned |
| 3 | Menu, add-ons, taxes, guest preview | ⬜ Planned |
| 4 | Guest QR ordering + realtime order creation | ⬜ Planned |
| 5 | Live Orders, Kitchen, Tables, Billing | ⬜ Planned |
| 6 | Shifts, settlement, payments, invoices | ⬜ Planned |
| 7 | Offers, coupons, loyalty, games, engagement | ⬜ Planned |
| 8 | Expenses, guests, reports, integrations, dashboard | ⬜ Planned |
| 9 | Marketing site, responsive polish, release hardening | ⬜ Planned |

### Stage 0 — Foundation ✅

- [x] Vite + React 19 + TS + Tailwind v4 project
- [x] React Router with public / auth / platform / app / guest route trees
- [x] CafePilot design tokens (dark charcoal, amber primary, cream text)
- [x] Supabase client with env handling (anon key only, never service role)
- [x] `lib/money` (integer paise, INR format), `lib/dates` (Asia/Kolkata), phone validation
- [x] Error boundary, 404, access denied, loading, offline banner
- [x] Route guards (blocked by default until Stage 1 auth)
- [x] Unit tests for money/dates/phone
- [ ] Generated DB types (needs Supabase project + `npm run gen:types`; placeholder in `src/types/database.ts`)

**Gate:** shells render, unauthorized access blocked, no secrets bundled, build + typecheck pass.

### Stage 1 — Tenancy, auth, onboarding, platform admin

Tables: profiles, vendors, restaurants, memberships, roles, permissions, audit_events, feature flags. RLS everywhere. Signup/verify/sign-in/reset, onboarding wizard, approval states, admin review queue, approve/reject/suspend/reactivate, audit view.

**Gate:** cross-tenant access fails safely; pending/suspended vendors blocked from operations; admin actions audited.

### Stage 2 — Restaurant profile, floor, staff, settings

Cafe profile + branding uploads (no SVG), GST/invoice settings, areas/tables, QR endpoint create/rotate (opaque hashed tokens), staff invites, roles, hashed counter PINs, discount ceilings, reset *preview* only.

**Gate:** permission matrix verified; upload validation rejects bad files; QR tokens leak no IDs.

### Stage 3 — Menu

Sections, dishes, availability, stations, images, veg marker, HSN/GST, add-ons, bulk price change with preview + audit, live guest preview.

**Gate:** guest menu follows enabled/available records; snapshots immune to menu edits; paise arithmetic.

### Stage 4 — Guest QR ordering

QR resolution, guest session, basket, call staff, checkout (name + mobile required), virtual-QR payment-first UPI/UTR, atomic bill/visit/round/ticket creation, guest Orders timeline, realtime with reconnect.

**Gate:** idempotent submit; revoked QR fails safe; two-browser realtime sync.

### Stage 5 — Live Orders, Kitchen, Tables, Billing

Ack/cancel/served, kitchen queues + timers + per-item ready + bump + recall, table states, staff billing rounds, park/void/discount/split.

**Gate:** illegal transitions rejected; item/ticket/order coherent; no lost items under concurrency.

### Stage 6 — Shifts, settlement, invoices

Shift open/close + cash variance, atomic idempotent settlement, GST-ready immutable invoices, fiscal-year sequencing, refunds, credit notes.

**Gate:** reconciliation tests pass; double-settle yields one; failed settle leaves bill open.

### Stage 7 — Offers, loyalty, games

Offers, coupons with transactional caps, loyalty ledger, server-side Roll the Dice / Stop the Clock with budget caps, welcome popup, notification drafts (never "sent"), feedback, consent.

**Gate:** coupon race cannot exceed caps; ledger reconciles; games server-decided.

### Stage 8 — Expenses, guests, reports

Expenses + receipts + standing costs, guest directory, reports, CSV export (formula-injection-safe), honest integrations/wallet "not live" states.

**Gate:** totals reconcile to source; exports respect tenant + role.

### Stage 9 — Marketing + hardening

Marketing page (no unverified pricing), responsive/a11y/print polish, runbooks, security/RLS/privacy/GST review.

**Gate:** E2E journeys pass desktop + mobile; no claim of unavailable integration.

## Explicit non-claims

- CafePilot does not process card/UPI funds. Entered UTR is not proof until staff confirm.
- Push, SMS, WhatsApp, email deferred. Delivery apps not live.
- Wallet, commission, subscriptions, ₹999 top-up not active.
- GST output needs professional validation before production.
- Production PII + payments need dedicated privacy/security/compliance review.

## Getting started

```bash
npm install
cp .env.example .env     # fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Scripts: `dev`, `build`, `typecheck`, `test`, `preview`.

Never put a Supabase service-role key in `.env` or any `VITE_*` var. It would ship to the browser.

## Structure

```text
src/
  app/            router, providers, route guards
  components/     ui, layout, feedback
  features/       one folder per product area (shells in Stage 0)
  lib/            supabase, money, dates, validation, permissions
  types/
docs/implementation-plan.md
```
