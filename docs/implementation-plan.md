# CafePilot — Architecture and Staged Implementation Plan

## 1. Product Goal

Build CafePilot as an India-first, multivendor restaurant management and QR-ordering SaaS. Each vendor account owns exactly one restaurant. CafePilot also has a separate super-admin dashboard for platform governance and support.

The application must connect restaurant operations and guest ordering end to end:

1. Restaurant configures its profile, floor, menu, taxes, staff, and payment instructions.
2. A guest opens a table or virtual-location QR link.
3. The guest browses the live menu, builds a basket, identifies themselves, optionally applies a coupon, and places an order.
4. The restaurant receives the order in Live Orders and Kitchen.
5. Kitchen and service actions advance the same canonical order state.
6. The guest sees those changes in realtime.
7. Restaurant staff settle the bill, release the table, and generate a GST-ready invoice.
8. Dashboard, reporting, guests, loyalty, activity, and audit records reflect the transaction.

The walkthrough is the primary feature and visual reference, but all product naming and branding will use **CafePilot**. Example records and commercial claims from the walkthrough are not treated as real business data or verified terms.

## 2. Confirmed Decisions

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4.
- **Backend:** Supabase managed backend.
- **Tenancy:** Multivendor SaaS; one vendor owns one restaurant.
- **Platform admin:** Governance and support admin without silent impersonation or arbitrary financial edits.
- **Vendor onboarding:** Self-signup, email verification, business submission, then CafePilot admin approval.
- **Authentication:** Authenticated restaurant staff; guest checkout without a required account.
- **Payments:** Record cash/card/UPI/other payments accurately; manual UPI UTR confirmation; keep a gateway abstraction but do not claim automated processing.
- **Notifications:** Realtime in-app updates first. Browser push, SMS, WhatsApp, and email remain provider-backed future integrations.
- **Commercial model:** Do not activate CafePilot wallet, commission, subscriptions, or top-ups yet.
- **Marketing:** Public premium marketing site, but no unconfirmed 2% or ₹999 pricing claims.
- **Tax/locale:** English UI, INR, Asia/Kolkata, Indian phone formats, configurable GST/HSN and fiscal-year invoice sequencing.
- **Delivery:** Build and verify in stages rather than creating the entire product in one pass.

## 3. Walkthrough Feature and Screen Inventory

### Public and onboarding

- Public marketing homepage with hero, target restaurant types, connected workflow explanation, feature grid, conversion sections, and footer.
- Vendor registration, email verification, sign-in, forgot/reset password.
- Vendor onboarding wizard for business details and approval submission.
- Pending, approved, rejected, and suspended account states.

### CafePilot super-admin

- Platform overview: vendor counts by status, active restaurants, orders/GMV operational metrics, recent incidents, and signup trend.
- Vendor review queue: inspect submitted business details, approve, reject with reason, suspend/reactivate.
- Vendor detail: profile, setup status, operational health, usage metrics, and immutable audit events.
- Feature flags and platform announcements.
- No support impersonation in the initial release.

### Restaurant operations

- Dashboard: business-day/shift status, warnings, sales, settled bills, covers, average bill, timeline, parked/open bills, top sellers, and floor overview.
- Tables live view: free/reserved/occupied states, parked bills, unsent baskets, live bill value, areas, and online-orders tile.
- Live Orders: counts and filters for acknowledgement, kitchen, readiness, served/cancelled states, and channels.
- Billing: table selection, per-table basket, menu search/categories, rounds, open bill, adjustments, split/park/void, and settlement.
- Kitchen display: station filters, ringing tickets, timers, start cooking, item readiness, ticket bump, and recall last bumped.
- Shift and cash drawer: open shift, opening float, cash movements, expected versus counted cash, discrepancy, and close shift.
- Invoices: search, invoice detail, printing, refund/credit-note initiation.
- Expenses: monthly navigation, summaries, categories, standing costs, receipt attachment, and monthly report.
- Guests and feedback: guest directory, visit/order history, loyalty balance, consent status, and submitted feedback.
- Reports: sales, order channels, payments, tax, item/category performance, staff actions, discounts/voids, expenses, and exports.
- Delivery apps/integrations: visible integration workspace with honest “not connected” states; no fake live provider connection.

### Configuration

- Menu Builder: sections, dish CRUD, vegetarian marker, descriptions, image upload, availability, stations, add-on groups, GST/HSN, bulk price changes, section ordering, and guest preview.
- Table Setup: areas, table CRUD, seat counts, in-service state, takeaway QR, first-order acceptance rule, and location safeguard rule.
- Table QR Codes: generated per table, card preview, print one, print all, scan-test guidance.
- Virtual QR Codes: named off-premises ordering points, mandatory payment-first behavior, and enable/disable controls.
- Offers & Loyalty:
  - Offers and eligibility rules.
  - Coupon codes and usage limits.
  - Welcome popup.
  - Notification composer as a non-sending draft until a provider exists.
  - Offer test calculator.
  - Loyalty earning, redemption, liability, expiry, and warning rules.
  - Roll the Dice and Stop the Clock with server-authoritative outcomes and budget caps.
- Payments settings: payment timing, UPI ID, payee name, optional UPI QR image, and manual UTR workflow.
- Staff: invitations/accounts, roles, counter PINs, discount ceilings, password reset flow, location-independent activity log.
- Settings:
  - Cafe profile and branding.
  - GST and invoicing.
  - Printing and service.
  - Sounds.
  - Appearance.
  - Integrations.
  - Reset cafe with destructive-action safeguards.
- Wallet and Plans: use a clearly labeled non-live informational/coming-soon state; do not simulate balances, commissions, recharges, or subscriptions.

### Guest experience

- Table and virtual QR landing routes with validated restaurant and location context.
- Notification/add-to-home onboarding prompts that accurately reflect browser support and permission state.
- Restaurant header, table/location label, call-staff action, menu categories, dishes, availability, and dietary markers.
- Basket quantity controls and sticky summary.
- Checkout with required name/mobile validation, coupon entry, bill details, kitchen note, and payment instructions appropriate to QR type.
- Orders view with table bill, rounds, items, status tracker, timestamps, add-more flow, and coupon handling.
- Rewards, loyalty balance/history, eligible rewards, games when enabled, account/preferences, offer opt-in, and feedback.
- Responsive mobile-first UI with accessible controls and resilient empty/loading/error states.

## 4. Application Architecture

### Frontend structure

Use a feature-oriented React application:

```text
src/
  app/
    router.tsx
    providers.tsx
    route-guards.tsx
  components/
    ui/
    layout/
    feedback/
  features/
    auth/
    onboarding/
    platform-admin/
    dashboard/
    tables/
    orders/
    billing/
    kitchen/
    menu/
    qr/
    promotions/
    loyalty/
    payments/
    invoices/
    expenses/
    shifts/
    staff/
    guests/
    reports/
    settings/
    guest-ordering/
  lib/
    supabase/
    money/
    tax/
    validation/
    permissions/
    dates/
  types/
```

Use React Router for public, platform-admin, restaurant-admin, kitchen, and guest route trees. Load route data through typed service modules rather than issuing database calls directly from presentational components. Keep server-authoritative operations such as order submission, status transitions, settlement, invoice numbering, refunds, loyalty posting, coupon redemption, game outcomes, and reset actions behind Supabase RPCs or Edge Functions.

### Route map

```text
/                                  Public marketing
/auth/sign-in
/auth/register
/auth/forgot-password
/onboarding
/approval-status

/platform                          CafePilot admin overview
/platform/vendors
/platform/vendors/:vendorId
/platform/audit
/platform/features

/app                               Restaurant dashboard
/app/tables
/app/live-orders
/app/billing
/app/kitchen
/app/menu
/app/qr/tables
/app/qr/tables/:tableId/print
/app/qr/virtual
/app/offers/*
/app/payments
/app/wallet                         Non-live informational state
/app/invoices
/app/invoices/:invoiceId
/app/expenses
/app/shifts
/app/staff
/app/guests
/app/reports
/app/integrations
/app/settings/*

/g/:restaurantSlug/table/:qrToken
/g/:restaurantSlug/virtual/:qrToken
/g/:restaurantSlug/menu
/g/:restaurantSlug/checkout
/g/:restaurantSlug/orders
/g/:restaurantSlug/rewards
/g/:restaurantSlug/account
```

QR URLs use opaque, revocable random tokens rather than sequential table IDs.

### Backend responsibilities

- **Postgres:** durable source of truth, relational constraints, money/tax records, state transitions, reports, and audit records.
- **Supabase Auth:** restaurant staff and platform admins.
- **Row Level Security:** tenant boundaries, role permissions, and restricted public guest reads/writes.
- **Storage:** menu images, restaurant logo/icon, expense receipts, and UPI QR images using private or public buckets as appropriate.
- **Realtime:** order, order-item, kitchen-ticket, bill, service-request, and table-state updates.
- **RPC/Edge Functions:** atomic multi-table commands and any operation requiring secrets or elevated checks.
- **Scheduled functions:** loyalty expiry, standing-expense reminders/materialization, stale-session cleanup, and aggregate refreshes where required.

No frontend service-role key. No client-side trust for restaurant IDs, roles, prices, discounts, tax, game outcomes, bill totals, payment status, or invoice numbers.

## 5. Core State Machines and Data Flow

### Vendor lifecycle

`draft → submitted → approved`

Alternative terminal/intervention states: `rejected`, `suspended`.

Only platform admins can approve, reject, suspend, or reactivate. Suspended vendors cannot create operational writes or accept new guest orders, while authorized owners retain limited access to status and support information.

### Order lifecycle

Canonical order statuses:

`submitted → accepted → cooking → ready → served`

Alternative terminal states: `rejected`, `cancelled`.

- `submitted`: guest/staff has sent a round.
- `accepted`: restaurant has acknowledged any order requiring acknowledgement.
- `cooking`: kitchen has started preparation.
- `ready`: all required items/tickets are ready or the authorized ticket action advances it.
- `served`: service staff explicitly marks it served.
- Item readiness and ticket bump are separate facts.
- Status transitions are validated server-side and written to an append-only `order_status_events` table.
- Realtime subscriptions update Live Orders, Kitchen, Billing, Tables, Dashboard, and the guest Orders screen from the same records.

### Bills and rounds

- One active table visit has one bill.
- Each submission creates an order round attached to that bill.
- Additional guest/staff rounds join the open bill.
- Prices, item names, taxes, HSN, and modifiers are snapshotted on each order item.
- Bill totals are calculated server-side from integer paise values.
- The UI labels item subtotal, discounts, coupon/points value, taxes, platform/service charges when configured, rounding, and final payable total consistently.
- Settlement is idempotent and uses a database transaction.
- Successful settlement records payment(s), closes the bill, issues an invoice number, posts loyalty, closes the table visit, and frees the table.
- Parked bills remain open and retain table/guest context.
- Split bills must preserve the original item and payment audit trail.

### Kitchen mapping

- Each dish maps to one station; add-ons may inherit the dish station.
- Sending a round creates station-specific tickets and ticket items.
- Ticket start updates relevant order progress to `cooking`.
- Individual items can become ready independently.
- Bumping a ticket records who bumped it and when; it does not erase the ticket.
- Recall restores only the authorized user’s most recently bumped eligible ticket and adds an audit event.

### Guest identity and consent

- A signed, HttpOnly guest-session cookie or secure server-issued session token associates the browser with a guest session.
- Name and Indian mobile number are required at order submission, not merely for browsing.
- Mobile number alone is not authentication and cannot expose another guest’s order history.
- Offer consent and future push consent are stored separately, timestamped, and revocable.
- Public guest queries are restricted to the active restaurant/menu context and orders authorized by the guest session.

### Manual payment integrity

- Cash, card, UPI, and other are recorded payment methods, not payment processing.
- For UPI payment-first flows, the guest supplies a UTR/reference and the restaurant confirms or rejects it.
- UI language must say “recorded” or “awaiting confirmation,” never “processed by CafePilot.”
- A `payment_provider` interface and webhook event table reserve a safe extension point for a future live gateway.

## 6. Proposed Database Schema

All monetary values use integer paise. All operational timestamps are stored as `timestamptz` and displayed in Asia/Kolkata. Primary keys are UUIDs unless a human-readable sequence is explicitly required.

### Platform and tenancy

- `profiles`: `user_id`, display name, phone, platform role, status.
- `vendors`: owner user, legal/display names, slug, onboarding status, approval metadata, suspension metadata.
- `restaurants`: one-to-one `vendor_id`, profile/address/contact/food type/timezone/currency, service state, branding paths.
- `vendor_memberships`: vendor, user, role, active state, invited/accepted timestamps.
- `roles`: owner, manager, cashier, kitchen, waiter, accountant, custom.
- `permissions` and `role_permissions`: granular capability mapping.
- `platform_feature_flags`: key, enabled/default, configuration.
- `vendor_feature_overrides`: vendor-specific flag state.
- `audit_events`: tenant/platform scope, actor, action, entity, before/after metadata, IP/user-agent where legally appropriate, timestamp.

### Restaurant setup

- `restaurant_settings`: ordering, service, sound, appearance, printing, integration, location-check, and first-order-acceptance settings.
- `tax_profiles`: GST mode, GSTIN, legal name, place/state code, inclusive/exclusive defaults, invoice prefix/fiscal year.
- `tax_rates`: CGST/SGST/IGST percentages and effective dates.
- `areas`: restaurant, name, sort order, active state.
- `restaurant_tables`: area, label, seats, service state, active state.
- `qr_endpoints`: restaurant, endpoint type (`table`, `virtual`, `takeaway`), table/location relation, name, token hash, payment-first, active, rotated timestamp.
- `kitchen_stations`: name, color, sort order, active state.

### Menu

- `menu_sections`: restaurant, name, description, sort order, guest-visible state.
- `menu_items`: section, station, name, description, price paise, vegetarian state, image, HSN/SAC, tax profile/rate, active/available state, sort order.
- `addon_groups`: restaurant, name, min/max selection, required, active.
- `addon_options`: group, name, price paise, tax metadata, active, sort order.
- `menu_item_addon_groups`: item/group relation and sort order.
- `menu_price_changes`: item, old/new price, actor, reason, effective timestamp.
- `menu_availability_events`: item, availability state, actor, timestamp.

### Guests and sessions

- `guests`: restaurant, normalized mobile, name, first/last visit, notes, marketing consent state.
- `guest_sessions`: restaurant, opaque token hash, guest if identified, QR endpoint, expiry, last activity.
- `service_requests`: session/table/visit, request type, status, acknowledged by/at.
- `feedback`: guest, visit/order, rating, text, resolution state.
- `notification_consents`: guest/session, channel, purpose, granted/revoked timestamps.

### Orders, kitchen, and tables

- `table_visits`: restaurant/table, guest count, state, opened/closed timestamps, opened by/channel.
- `bills`: restaurant, visit or virtual endpoint, sequential bill number, state (`open`, `parked`, `settled`, `void`), totals, guest, timestamps.
- `orders`: bill, round number, channel, status, guest/session, note, acknowledgement requirement, timestamps.
- `order_items`: order, menu item reference, snapshotted name/price/tax/HSN, quantity, note, fulfillment status.
- `order_item_addons`: order item, snapshotted option and price, quantity.
- `order_status_events`: order, from/to state, actor type/id, reason, timestamp.
- `kitchen_tickets`: order, station, state, ringing/start/bumped/recalled timestamps and actors.
- `kitchen_ticket_items`: ticket/order item, quantity, state, ready timestamp/actor.
- `bill_adjustments`: bill, type (`discount`, `coupon`, `points`, `fee`, `rounding`, `void`), paise amount, reason, authorizer.
- `bill_splits`: source bill, split bill, strategy, actor.
- `bill_split_items`: split mapping and quantities.

### Payments and invoicing

- `payment_settings`: restaurant, timing, UPI ID, account name, QR path, confirmation rules.
- `payments`: bill, method, amount paise, state (`pending`, `recorded`, `confirmed`, `failed`, `refunded`), UTR/reference, recorded/confirmed actors and timestamps.
- `payment_attempts`: idempotency key, provider/manual type, request state, failure code, timestamps.
- `payment_webhook_events`: reserved for future gateway, provider event ID, verified state, payload metadata.
- `invoices`: restaurant, bill, fiscal year, sequential invoice number, issue state, immutable restaurant/customer/tax/payment snapshots, totals.
- `invoice_items`: immutable line snapshots.
- `credit_notes`: invoice, sequential number, reason, totals, issue timestamp, actor.
- `refunds`: payment/invoice, amount, method, state, reason, actor and timestamps.
- `invoice_sequences`: restaurant/fiscal year, next bill/invoice/credit-note values, locked transactionally.

### Staff, shifts, and cash

- `staff_profiles`: membership, employee display data, counter PIN hash, sign-in metadata.
- `discount_limits`: membership/role, maximum percent and/or paise amount.
- `staff_activity`: actor, event type, entity, manager authorization, timestamp.
- `shifts`: restaurant, opened by/at, opening float, state, closed by/at, counted cash, expected cash, variance.
- `cash_movements`: shift, type (`sale`, `refund`, `pay_in`, `pay_out`, `expense`), amount, reference, actor.

### Promotions and loyalty

- `offers`: restaurant, guest-facing copy, discount/eligibility/schedule configuration, budget/caps, state.
- `coupons`: code, benefit type/value, minimum bill, validity, total/per-guest caps, state.
- `coupon_redemptions`: coupon, guest, bill/order, amount, timestamp; unique constraints enforce limits where possible.
- `welcome_popups`: content, schedule, audience, state.
- `notification_drafts`: heading, message, audience definition, state; no false sent counts without a provider.
- `loyalty_programs`: earn/redeem ratios, thresholds, cap, rounding, expiry/warning settings, enabled state.
- `loyalty_accounts`: guest/restaurant, cached available balance.
- `loyalty_ledger`: immutable earn/redeem/expire/adjust entries, bill reference, expiry.
- `games`: type, rules, prize, chance/tolerance, daily budget, min bill, phone requirement, enabled state.
- `game_attempts`: guest/session, server timestamp/outcome, prize value, redemption state.
- `prizes`: game attempt, reward definition, validity, redemption record.

### Expenses and reporting

- `expense_categories`: restaurant, name, active state.
- `expenses`: amount, category, date, payee, note, receipt path, standing-cost source, payment method, actor.
- `standing_expenses`: schedule, amount/category/payee, start/end, active state.
- Reporting initially uses indexed transactional queries and database views; introduce materialized daily aggregates only after measured need.

### Integrations and future commercial data

- `integration_connections`: vendor, provider, state, configuration metadata, last sync/error; secrets remain server-side.
- `integration_events`: provider, direction, external ID, state, retry metadata.
- `platform_announcements`: audience, content, active window.
- Do not create fake wallet transactions, subscription charges, or commission debits. A future monetization stage can add plans, subscriptions, entitlements, wallet ledger, and gateway-backed top-ups.

## 7. Security and Validation

- Enable RLS on every exposed table.
- Vendor staff may access only rows whose `vendor_id`/`restaurant_id` is reachable through an active membership.
- Platform-admin access uses explicit platform roles and audited server-side actions.
- Guest access uses constrained RPCs and secure session context, not unrestricted anonymous table access.
- Owner-only actions: GST identity, destructive cafe reset, owner transfer, discount ceilings, critical integrations.
- Permission checks occur server-side even when the UI hides controls.
- Hash counter PINs; never store plaintext PINs.
- Validate uploads by MIME signature, extension, size, dimensions where applicable, and bucket policy. Reject SVG branding uploads as documented.
- Use unique constraints and idempotency keys for order submission, settlement, invoice issuance, coupon redemption, and future webhook handling.
- Rate-limit public QR, checkout, coupon, call-staff, auth, and game endpoints.
- Sanitize rich/free text, cap lengths, normalize Indian phone numbers, and validate dates/ranges.
- Use CSP-compatible patterns, no secret keys in the browser, and no sensitive values in logs.
- Preserve immutable transaction snapshots so later menu/profile edits cannot rewrite historical bills or invoices.
- Destructive reset requires owner reauthentication, typed confirmation, a preview of impact, and a server-side soft-delete/anonymization policy rather than uncontrolled cascading deletion.
- CafePilot in Figma Make is not an appropriate final environment for collecting real PII or handling production-sensitive payment data without a dedicated security, privacy, compliance, backup, and deployment review.

## 8. UI and Design Direction

- Premium dark charcoal foundation with warm orange/amber primary actions, muted cream text, restrained green/blue/red status colors, subtle borders, and layered panels.
- Use a distinctive hospitality-focused visual system rather than a generic admin template.
- Restaurant desktop surfaces use a persistent collapsible left rail and top operational status bar.
- Guest ordering is mobile-first with a sticky basket/checkout action and bottom navigation.
- Kitchen uses high-contrast, glanceable cards, large timers, and touch-sized controls.
- Billing prioritizes dense but legible table/menu/bill columns on desktop and intentional stacked views on smaller screens.
- Super-admin is visually related to CafePilot but clearly separated from restaurant operations.
- Typography, spacing, color tokens, radii, elevation, form states, focus states, skeletons, empty states, and status chips are centralized in the design system.
- Icons come from one consistent icon library; no emoji UI.
- Accessibility target: keyboard navigation, visible focus, semantic landmarks, labels and errors, reduced-motion support, sufficient contrast, and touch targets.

## 9. Implementation Stages and Acceptance Gates

Each stage is implemented, tested, and reported before the next begins. Every report lists completed work, known limitations, and the next stage.

### Stage 0 — Backend connection and project foundation

1. Connect the Figma Make project to Supabase before backend implementation.
2. Add routing, query/state conventions, validation library, icon library, QR generation library, money/date utilities, and the CafePilot design tokens.
3. Create public, auth, restaurant, guest, and platform-admin shells.
4. Establish generated database types and environment handling.
5. Add global error boundary, not-found, access-denied, loading, and offline/retry states.

**Gate:** responsive route shells render; unauthorized route access is blocked; no secrets are bundled; build/type validation succeeds.

### Stage 1 — Tenancy, authentication, onboarding, and platform admin

1. Implement profiles, vendors, restaurants, memberships, roles, permissions, audit events, and RLS.
2. Build vendor signup, verification, sign-in, reset, onboarding, submission, and approval-status flows.
3. Build super-admin overview, review queue, vendor detail, approve/reject/suspend/reactivate actions, audit view, and feature flags.
4. Add seeded local/demo fixtures only where clearly labeled and isolated from production data.

**Gate:** cross-tenant access tests fail safely; pending/suspended vendors cannot enter operations; approval enables the correct restaurant owner; admin actions are audited.

### Stage 2 — Restaurant profile, floor, staff, and settings

1. Implement cafe profile, branding uploads, GST/invoice settings, appearance, service, sound, printing, and integrations placeholders.
2. Implement areas, tables, table states, ordering rules, and QR endpoint creation/rotation.
3. Implement staff invitations, roles, counter PIN setup, discount ceilings, and activity history.
4. Implement owner-protected reset preview without enabling irreversible production deletion prematurely.

**Gate:** owner/manager/kitchen/cashier permission matrix is verified; file validation rejects invalid/oversized formats; QR tokens cannot reveal internal IDs.

### Stage 3 — Menu, add-ons, taxes, and preview

1. Implement section and dish CRUD, ordering, availability, station assignment, images, vegetarian markers, HSN/GST, and add-ons.
2. Implement bulk price updates with preview and audit history.
3. Implement live guest-menu preview from persisted menu data.
4. Add empty, loading, validation, conflict, and upload-failure states.

**Gate:** guest-visible menu exactly follows enabled/available records; historical snapshots are unaffected by menu edits; tax/price arithmetic uses paise.

### Stage 4 — Guest QR ordering and realtime order creation

1. Build table/virtual QR resolution, secure guest session, restaurant/table context, menu, basket, call staff, checkout, coupon placeholder wiring, and kitchen notes.
2. Build payment-first manual UPI/UTR flow for virtual QR endpoints.
3. Create bills, visits, rounds, order items, and initial kitchen tickets atomically.
4. Build guest Orders timeline and add-another-round behavior.
5. Add realtime subscriptions with reconnect and stale-data recovery.

**Gate:** duplicate submissions are idempotent; invalid/revoked QR codes fail safely; required guest fields validate; two browser sessions demonstrate restaurant/guest realtime synchronization.

### Stage 5 — Live Orders, Kitchen, Tables, and Billing

1. Implement Live Orders counts, filters, cards, acknowledgement, cancellation, mark-served, and bill navigation.
2. Implement kitchen station queues, ringing state, timers, start cooking, per-item ready, bump, and recall.
3. Implement operational table states and dashboard floor state from canonical visits/bills.
4. Implement staff-created billing rounds, open/park/void behavior, discounts with ceiling authorization, coupons, points hooks, and split-bill rules.
5. Keep `ready` and `served` as separate explicit transitions.

**Gate:** transition matrix rejects illegal moves; item/ticket/order states remain coherent; guest timeline reflects restaurant actions; concurrent edits do not duplicate rounds or lose bill items.

### Stage 6 — Shifts, settlement, payments, and invoices

1. Implement shift open/close, opening float, cash movements, expected/count/variance, and no-open-shift warnings.
2. Implement settlement dialog, cash received/change, card/UPI/other recording, split payments, and optional bill name/phone.
3. Implement atomic settlement, duplicate-settlement prevention, table release, and loyalty posting hook.
4. Implement fiscal-year bill/invoice sequencing, immutable GST-ready invoice, print view, search, refund record, and credit note.
5. Clearly label manual payment and UTR confirmation states.

**Gate:** money reconciliation tests pass; simultaneous settlement attempts result in one settlement; invoices are unique and match bill snapshots; failed settlement leaves bill/table open; refund does not silently rewrite the original invoice.

### Stage 7 — Offers, coupons, loyalty, games, and guest engagement

1. Implement offers, eligibility, schedules, budgets, and test-offer calculator.
2. Implement coupons and enforce date/minimum/overall/per-guest limits transactionally.
3. Implement loyalty configuration, ledger, redemption caps, expiry, liability summary, and guest rewards view.
4. Implement server-authoritative Roll the Dice and Stop the Clock with daily budget enforcement.
5. Implement welcome popup and notification drafts. Do not mark drafts as delivered without a real provider.
6. Implement feedback and guest offer-consent preferences.

**Gate:** coupon race tests cannot exceed caps; loyalty ledger reconciles to balances; games cannot be decided client-side or exceed budget; disabled promotions never apply.

### Stage 8 — Expenses, guests, reporting, integrations, and dashboard completion

1. Implement expenses, categories, receipts, standing costs, month views, and summaries.
2. Implement guest directory/history, feedback review, and consent visibility.
3. Complete dashboard metrics and reports for sales, taxes, channels, payments, menu performance, discounts/voids, staff actions, shifts, and expenses.
4. Add CSV exports with permission checks and formula-injection-safe encoding.
5. Add honest integrations workspace states and delivery-app placeholders without fabricated connectivity.
6. Keep Wallet and Plans as a clearly labeled non-live product area.

**Gate:** dashboard/report totals reconcile to source records; exports respect tenant and role boundaries; empty and partial-data states are accurate.

### Stage 9 — Public marketing, responsive polish, and release hardening

1. Build the CafePilot marketing page using the walkthrough’s connected-workflow story without unverified pricing claims.
2. Finish responsive behavior across operator, kitchen, billing, platform-admin, print, and guest surfaces.
3. Complete accessibility pass, keyboard paths, print layouts, performance optimization, and error copy.
4. Add operational runbooks for vendor approval, payment disputes, refunds, invoice correction, backups, and incidents.
5. Conduct security/RLS review, data retention/privacy review, GST review with a qualified professional, and production deployment review.

**Gate:** critical end-to-end journeys pass on desktop and mobile; no feature claims an unavailable integration; release checklist and known limitations are documented.

## 10. Verification Strategy

### Automated

- Unit tests for money rounding, tax calculation, bill adjustments, coupon eligibility, loyalty math, invoice fiscal year logic, permissions, and state-transition guards.
- Database tests for RLS, uniqueness, check constraints, tenant isolation, idempotency, coupon caps, and invoice sequencing.
- Integration tests for submit order, update kitchen status, mark served, settle, invoice, refund/credit note, and shift reconciliation.
- Component tests for validation, disabled/loading/error states, and permission-based actions.
- End-to-end tests for:
  1. Vendor signup → admin approval → owner access.
  2. Menu/table setup → QR guest order.
  3. Guest order → kitchen cooking/ready → guest realtime update.
  4. Ready → served → billing settlement → invoice → table free.
  5. Multi-round bill.
  6. Parked and split bill.
  7. Manual virtual-QR UPI confirmation.
  8. Coupon and loyalty redemption.
  9. Shift cash reconciliation.
  10. Cross-tenant and role-denial attempts.

### Manual

- Responsive checks for common mobile, tablet, laptop, wide billing, kitchen display, and print dimensions.
- QR scan tests using a physical phone and printed card at 100% scale.
- Realtime tests with separate guest, kitchen, waiter, cashier, and admin browser sessions.
- Network-loss/reconnect, double-click, stale tab, and concurrent action checks.
- Keyboard, focus, screen-reader labels, contrast, and reduced-motion checks.
- Manual validation that each walkthrough screen and workflow is represented or explicitly marked as deferred/non-live.

## 11. Explicit Non-Claims and Deferred Integrations

- CafePilot will not claim to process card or UPI funds in the initial release.
- A manually entered UTR is not proof of payment until restaurant staff confirms it.
- Browser push, SMS, WhatsApp, and email delivery are deferred until providers and credentials are selected.
- Delivery-app integrations are not live until provider APIs and agreements exist.
- Platform wallet, commission, subscriptions, ₹999 top-up, and the walkthrough’s pricing are not active.
- GST-ready structure and invoice output require professional legal/accounting validation before production use.
- Geolocation safeguards depend on browser permission and accuracy; unavailable or low-confidence location falls back to staff acceptance rather than silently trusting the order.
- Production PII and financial operations require a dedicated privacy/security/compliance review outside the prototype environment.

## 12. Immediate Next Step After Plan Approval

Connect Supabase from the Figma Make settings flow, then execute **Stage 0 only**. Report its verification results and any blockers before beginning Stage 1.
