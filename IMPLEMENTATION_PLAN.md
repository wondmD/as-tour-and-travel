# AS Tour & Travel — Frontend Implementation Plan

> From a static single-tour demo to the frontend of a modern, automated Tour & Travel Management Platform.
>
> **Scope of this repo:** frontend only. All business logic, database, payments processing, and integrations live in a **separate backend repo** exposing an HTTP API. This document plans the frontend work and defines the API contract it depends on.
>
> Based on the SRS (July 2026) — and deliberately going beyond it.

---

## 1. Where We Are Today

The current codebase is a **polished static marketing site** for one tour:

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Leaflet/OpenStreetMap · Lucide icons
- **Content:** One hardcoded tour (`src/data/tour-001.ts`, ~725 lines), hardcoded testimonials, gallery, and landing copy
- **Booking:** A modal with `tel:` / `mailto:` links — no real booking pipeline
- **Backend:** None yet — will be built as a separate service
- **What's already great and must be preserved:** the visual design system, the interactive tour route explorer + map, animations, SEO/JSON-LD, EN/AR support

**Strategy:** Keep the frontend DNA (design, route explorer, motion). Replace every hardcoded data source with API calls to the backend, and build three surfaces on top of the existing design system: the public site, the traveler portal, and the admin dashboard.

---

## 2. Target Architecture

### 2.1 High-Level Picture

```
┌──────────────────────────────────────────────────────────────┐
│                THIS REPO — Next.js 16 Frontend               │
│                                                              │
│  Public Site         Traveler Portal       Admin Dashboard   │
│  (marketing,         (/account: bookings,  (/admin: RBAC-    │
│   tours, hotels,      trips, wallet,        gated management │
│   blog, guides)       journal, wishlist)    + analytics UI)  │
│                                                              │
│  ── Data layer ──────────────────────────────────────────    │
│  Server Components fetch · TanStack Query (server state) ·   │
│  Zustand (UI/wizard state) · Formik + Yup (forms) ·          │
│  Route Handlers as thin BFF proxy (auth cookies, uploads)    │
└──────────────────────────────┬───────────────────────────────┘
                               │  HTTPS · JSON · OpenAPI-typed client
                               ▼
┌──────────────────────────────────────────────────────────────┐
│              SEPARATE REPO — Backend API                     │
│  Auth/RBAC · Catalog · Bookings · Payments (Chapa/Stripe)    │
│  Notifications · CMS · Reviews · Promotions · Support        │
│  PostgreSQL · Redis · object storage · background jobs       │
│  Webhooks from payment/SMS/WhatsApp providers land HERE      │
└──────────────────────────────────────────────────────────────┘
```

**Division of responsibility:**

| Concern | Frontend (this repo) | Backend (separate repo) |
|---|---|---|
| Rendering, SEO, i18n, animations | ✅ | — |
| Forms, validation UX, booking wizard state | ✅ (Yup client-side) | Re-validates everything |
| Auth session handling | Stores httpOnly cookie, guards routes in `middleware.ts` | Issues/verifies tokens, hashes passwords, OAuth |
| Pricing display | Renders backend-computed quotes | Owns the pricing engine (single source of truth) |
| Payments | Checkout UI, redirect to gateway, status polling | Gateway integration, webhooks, reconciliation |
| Inventory/seat holds | Shows availability, countdown timers | Locking, holds, release jobs |
| PDFs (invoices, tickets, itineraries) | Download links | Generation |
| QR ticket validation | Staff PWA scanner page (camera) | Signature verification, single-use enforcement |
| File uploads | Presigned-URL upload UI | Issues presigned URLs, processes media |
| Notifications | In-app notification center (SSE), preference UI | Sending, templates, retries, delivery log |
| Analytics dashboards | Charts and report UI | Aggregation queries, report/export endpoints |

**Golden rule:** the frontend never computes money, availability, or permissions on its own — it renders what the API returns. Client-side checks are UX sugar only.

### 2.2 Frontend Technology Decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 App Router** (already in place) | Server Components fetch from the API on the server (fast, SEO-friendly), streaming, PPR for public pages |
| API client | **Generated typed client from the backend's OpenAPI spec** (`openapi-typescript` + `openapi-fetch`) | End-to-end type safety without sharing code between repos; the spec *is* the contract |
| Server state | **TanStack Query v5** for client components | Caching, optimistic updates, polling (payment status), infinite lists |
| Client/UI state | **Zustand** (with `persist` middleware where needed) | Booking wizard progress, trip planner board, notification drawer, admin table prefs — survives refresh without prop drilling |
| Auth session | Backend-issued session cookie (httpOnly, same-site) proxied via BFF route handlers; `middleware.ts` guards `(portal)` and `(admin)` | Tokens never touch client JS; RBAC claims read server-side |
| Forms | **Formik + Yup** validation schemas | Booking wizard, admin CRUD forms; schemas mirror API DTOs |
| Validation schemas | **Yup**, hand-written to mirror API DTOs, shared across forms | Instant field-level errors before hitting the API |
| UI components | Keep custom `src/components/ui/`; add **Radix primitives** for a11y-critical widgets (dialog, popover, tabs, select) | Accessible without restyling the existing look |
| Data tables (admin) | **TanStack Table** | Server-driven sort/filter/pagination for admin lists |
| Charts (admin) | **Recharts** | Revenue, bookings, funnel dashboards |
| Drag & drop | **dnd-kit** | Trip planner day board, itinerary editor |
| Maps | Keep **Leaflet + OSM**; render backend-provided routes/distances | Backend proxies OpenRouteService; no keys in frontend |
| i18n | **next-intl** (EN, AM, AR, FR, ZH) — replaces the Google Translate widget | Real translations, RTL for Arabic, localized dates/currency (LNG-01…04); translated CMS content comes from the API |
| PWA / offline | Service worker (**Serwist**) + IndexedDB for itineraries, tickets, vouchers | PLAN-06 offline access; installable app |
| Realtime | **SSE** from backend for notifications; WebSocket (backend-provided) for live chat & tracking | Simple where possible |
| QR scanning | **@zxing/browser** camera scanner on staff validator page | TCK-05 without native apps |
| Uploads | Presigned-URL direct-to-storage uploads with progress UI | Journal photos, review photos, admin media |
| Analytics | **PostHog** snippet | Booking funnel drop-off analysis |
| Monitoring | **Sentry** (browser + server runtime) | Frontend error visibility |
| Testing | **Vitest** (components/utils) · **Playwright** (e2e against mocked API via **MSW**) | Money-path flows tested without a live backend |
| Mock backend | **MSW** handlers generated from the OpenAPI spec | Frontend development can run ahead of backend delivery |
| CI/CD | GitHub Actions → Vercel; preview deploys point at backend staging | Contract tests run against the spec on every PR |

### 2.3 Repository Layout (target)

```
src/
├── app/
│   ├── (marketing)/            # public: home, destinations, blog, guides, promos
│   ├── (booking)/              # tours, hotels, transport, tickets, flights, checkout
│   ├── (portal)/account/       # traveler portal: bookings, trips, journal, wallet
│   ├── (admin)/admin/          # admin dashboard (RBAC-gated by middleware)
│   └── api/                    # BFF only: auth cookie proxy, SSE relay, upload helpers
├── lib/
│   ├── api/                    # generated OpenAPI client + typed fetch wrappers
│   ├── auth/                   # session helpers, RBAC guards for UI
│   ├── schemas/                # Yup validation schemas mirroring API DTOs
│   ├── stores/                 # Zustand stores (wizard, planner, UI state)
│   └── i18n/                   # next-intl config, locale utils
├── components/                 # existing structure preserved and grown
│   ├── ui/  layout/  landing/  tour/  booking/  portal/  admin/  ...
├── messages/                   # next-intl translation files (en, am, ar, fr, zh)
└── mocks/                      # MSW handlers for dev/testing
```

**Key principle:** all API access goes through `lib/api/` typed wrappers. No component ever hand-writes a fetch URL. When the backend spec changes, the type errors show exactly what to update.

---

## 3. API Contract (What the Frontend Needs from the Backend)

The two repos meet at an **OpenAPI spec, versioned in the backend repo** and consumed here to generate the client and MSW mocks. Resource domains the frontend will consume (mirrors SRS §7.1):

- **Auth:** register, login, logout, email verification, password reset, OAuth (Google/Apple), session/me, saved companions, wishlist
- **Catalog:** tours (list w/ filters + search, detail, departures, availability), destinations, attractions, hotels/rooms/availability, transport routes/schedules, ticket products, flights (search/offers)
- **Commerce:** cart, quotes (price calculation), bookings (create/list/detail/cancel/reschedule), checkout session (returns gateway redirect URL), payment status, invoices/vouchers/tickets (PDF URLs), coupons (validate/apply), loyalty balance, referrals
- **Experience:** trips (planner CRUD, items, reorder), route computation (distances/durations), check-ins, journal entries + media, reviews (submit/list/react/report)
- **Content:** destination guides, blog posts, banners, FAQs, pages, emergency contacts, promotions — all locale-aware (`?locale=am`)
- **Support:** contact form, support tickets + messages + attachments, chat (WS endpoint), notification feed (SSE) + preferences
- **Admin:** every management resource (users/roles, tours, departures, hotels, transport, tickets, bookings ops, refunds, transactions, reviews moderation, CMS, coupons/campaigns, settings) + analytics/report endpoints with date-range params + export (PDF/Excel) URLs
- **Media:** presigned upload URL issuance, asset metadata

**Conventions to agree with the backend team (week 1):**
- Cursor pagination (`?cursor=&limit=`), standard error envelope (`{ code, message, fields? }`), idempotency keys on booking/checkout POSTs, locale via query/header, RBAC claims embedded in the session so the frontend can hide (not enforce) forbidden UI

---

## 4. Phased Roadmap

Phases match the backend's delivery plan; each phase lists **frontend deliverables** and the **backend endpoints it blocks on**. MSW mocks let frontend work start before backend endpoints land.

### Phase 0 — Foundation (Week 1–2)
> "Wire up the plumbing."

- [ ] Agree API conventions + first OpenAPI draft with backend team; set up client generation (`lib/api/`) and MSW mocks
- [ ] Restructure `app/` into route groups: `(marketing)`, `(booking)`, `(portal)`, `(admin)`
- [ ] Auth UI: register, login, verify-email, forgot/reset password pages; session cookie handling via BFF; `middleware.ts` guards for portal/admin (AUTH-01…07)
- [ ] Replace static tour data source: tour page and landing sections fetch from the API (backend seeds tour-001 from `src/data/tour-001.ts` — hand them the file); keep the static file as dev fallback until parity, then delete
- [ ] `next-intl` scaffold with locale routing (`/am`, `/ar`, …) and RTL layout; migrate existing EN/AR strings out of the Google Translate widget
- [ ] Sentry, PostHog, CI (typecheck, lint, Vitest, Playwright smoke against MSW)
- **Backend needs:** auth endpoints, session/me, tours read endpoints
- **Exit criteria:** tour-001 renders 100% from the API; users can register, verify email, and log in.

### Phase 1 — Tour Catalog + Booking + Checkout (Week 3–6) ⭐ *revenue path*
> The single most important flow: browse → select → pay → confirmed.

- [ ] **Tours listing page** with filters (destination, budget, duration, category, season, date, rating) + keyword search, URL-synced filter state, skeleton loading (TOUR-01…04)
- [ ] Tour detail upgrades: departure picker with live seat availability, per-departure pricing
- [ ] **Booking wizard** (multi-step, resumable, mobile-first): departure & travelers → traveler details (with saved companions) → add-ons → coupon → review & pay (USE-01, TOUR-05/06); step state in a persisted Zustand store so a refresh doesn't lose progress, Formik + Yup per step; every price shown comes from the backend quote endpoint
- [ ] **Checkout:** payment method selection (Telebirr, CBE Birr, cards via Chapa; Stripe international), redirect to gateway, return page with status polling, pending-state UX with clear messaging (PAY-01…04, REL-02)
- [ ] Inventory-hold countdown timer in the wizard (backend holds seats; frontend shows expiry)
- [ ] Traveler portal v1: `/account/bookings` — list, detail, cancel per policy, download invoice PDF (BKG-01…05)
- [ ] Custom tour request form (TOUR-07)
- [ ] Wishlist with optimistic toggle (AUTH-11)
- **Backend needs:** quotes, bookings, checkout sessions, payment status, coupons validate, invoices, custom requests, wishlist
- **Exit criteria:** a stranger can discover a tour, pay with Telebirr or Visa, and land on a confirmed-booking page — zero human involvement.

### Phase 2 — Admin Dashboard UI (Week 6–10)
> Automate the agency's side of the workflow.

- [ ] Admin shell at `/admin`: sidebar nav, TanStack tables with server-driven search/filter/pagination, command palette (⌘K), role-aware menu
- [ ] **Tour management:** CRUD forms, itinerary-day editor (dnd-kit reorder), media upload (presigned URLs), departures & capacity calendar, publish/unpublish/archive (TOUR-09/10, ADM-06)
- [ ] **Booking operations:** confirm/modify/cancel/refund flows with confirmation dialogs, status history timeline, manual (offline) payment approval (BKG-06, ADM-10)
- [ ] **Payments desk:** transaction list, reconciliation view, refund initiation (ADM-12)
- [ ] **User & role management** UI (ADM-04/05)
- [ ] **CMS screens:** destinations (structured section editor per DST-01), blog (rich text — TipTap), banners, FAQs, emergency contacts; draft/publish states; per-locale translation tabs (DST-03, BLG-04, EMR-04)
- [ ] **Analytics dashboard:** revenue, bookings, conversion funnel, popular tours, recent activity; date-range filters; export buttons (ADM-01…03, ADM-16)
- [ ] Review moderation queue (REV-05)
- [ ] Settings panel UI: taxes, fees, currencies, cancellation rules, notification templates (ADM-17)
- **Backend needs:** full admin CRUD + analytics/report/export endpoints, media presign
- **Exit criteria:** staff never edits code or TypeScript files to run the business.

### Phase 3 — Notifications, Reviews, Promotions, Support (Week 10–13)
> Close the loop around the customer.

- [ ] **In-app notification center:** SSE-powered bell, unread counts, history, mark-as-read, per-channel preference toggles (NTF-01, NTF-05)
- [ ] **Reviews & ratings UI:** submit (rating, comment, photos, visit date — gated to verified bookings by the API), display with sorting, like/report actions, aggregate stars on cards (REV-01…04)
- [ ] **Promotions surfaces:** coupon field with inline validation feedback at checkout (PRM-03), promotions landing page, referral page with shareable code, loyalty balance + redemption at checkout (PRM-01)
- [ ] **Support:** contact form, FAQ pages (searchable, grouped), traveler ticket portal with attachments and status tracking, **agent inbox** in admin (assign/respond/escalate/close), live chat widget (backend WS), WhatsApp deep-link button (SUP-01…06)
- **Backend needs:** notification feed/SSE + prefs, reviews, coupons/loyalty/referrals, support tickets + chat WS
- **Exit criteria:** the full SRS §10.1 booking workflow runs end-to-end with automated notifications visible in-app at every step.

### Phase 4 — Trip Planner, Tracking, Journal, Tickets (Week 13–17)
> The features that make travelers *live* in the product.

- [ ] **Travel route planner:** create named trips; drag-and-drop day board (dnd-kit); add destinations, attractions, hotels, activities, notes; route map rendering backend-computed distances/durations (PLAN-01…04)
- [ ] **Offline itineraries:** PWA (Serwist service worker + IndexedDB) caching trips, vouchers, tickets; downloadable itinerary PDF (PLAN-06)
- [ ] **Interactive map hub:** attractions, hotels, restaurants, hospitals, police, fuel, forex layers (data via API); nearby search, distance display, deep links to Google Maps/OsmAnd navigation; location permission UX (MAP-01…05)
- [ ] **Travel tracking:** opt-in check-ins, visited/remaining progress, trip timeline, one-tap disable (TRK-01…05)
- [ ] **Travel journal:** entries per trip, photo uploads (presigned), private/public toggle, public journal pages (JRN-01…03) + moderation queue in admin (JRN-04)
- [ ] **Ticket purchasing:** ticket product pages, purchase flow, QR ticket display + PDF download, purchase history (TCK-01…04)
- [ ] **Staff QR validator:** installable PWA page with camera scanner (@zxing), validate via API, clear valid/used/invalid states, offline-tolerant queue (TCK-05/06)
- [ ] **Emergency assistance:** per-destination emergency page, nearby hospitals/police, one-tap SOS share (EMR-01…03)
- **Backend needs:** trips, route computation, check-ins, journal, ticket products + issuance + validation, emergency content, map POI data
- **Exit criteria:** a traveler on the road uses the platform daily — itinerary, map, check-ins, tickets — even with spotty connectivity.

### Phase 5 — Hotels, Transport, Flights (Week 17–22)
> Expand from tours to full travel commerce.

- [ ] **Hotel search & booking UI:** search (location, dates, guests, price, rating, amenities), hotel detail with rooms/availability calendar, booking + checkout reuse (HTL-01…06); **partner portal screens** for hotel partners to manage inventory and rates (HTL-07)
- [ ] **Transportation UI:** transfers, car rentals, bus/train tickets, private drivers — search, detail, booking (TRN-01…04); admin management screens (TRN-05)
- [ ] **Flight search UI** (feature-flagged): one-way/round-trip/multi-city search forms, results with airline/times/stops/baggage, passenger details, e-ticket display, history (FLT-01…07)
- [ ] **Unified multi-service cart:** tour + hotel + transfer in one checkout, one payment, one confirmation page
- **Backend needs:** hotel/transport/flight domains, unified cart + combined checkout
- **Exit criteria:** the platform sells four service types through one cart and one admin.

### Phase 6 — Intelligence & Polish (Week 22+)
> Beyond the SRS: what makes it a *modern* platform. See §5.

---

## 5. Beyond the Document — Modern Differentiators

The SRS marks these "out of scope / future." We design the frontend so none of them require rework later (AI features are backend-powered; the frontend ships the surfaces):

1. **AI Trip Designer** — conversational planner UI ("10 days in Ethiopia in October, love history, mid budget") streaming a day-by-day itinerary composed by the backend from real catalog inventory, saveable as a trip and bookable in one click
2. **AI concierge in support chat** — same chat widget; backend routes between bot (RAG over CMS content) and human agents with seamless handoff
3. **Smart waitlists** — full departures show "join waitlist"; auto-offered seats arrive as notifications with a payment link and hold timer
4. **PWA-first mobile experience** — installable app, offline itineraries/tickets/maps, push notifications; most of a native app without the SRS's out-of-scope native builds
5. **Live trip ops board (admin)** — real-time view of active trips: vehicle location, check-in progress, SOS alerts
6. **Social proof engine** — public shareable trip pages and journal stories with auto-generated OG images; referral codes woven into every share
7. **Group booking & split pay** — one organizer invites companions; each traveler pays their share; booking confirms when fully funded (huge for the diaspora/group market this agency serves)
8. **Multi-currency display** — ETB/USD/SAR/EUR switcher using backend-provided rates; gateway charges in native currency
9. **Dynamic pricing assistant (admin)** — UI for backend price suggestions per departure; admin approves, never silent
10. **Review sentiment digest (admin)** — weekly AI summary card: what travelers loved, what's breaking
11. **Sustainability layer** — per-tour local-community impact notes and CO₂ estimates on tour pages

---

## 6. Non-Functional Implementation Notes (Frontend Slice)

**Security (SEC-01…07)**
- Session cookie is httpOnly/same-site via BFF proxy — tokens never in localStorage or client JS
- `middleware.ts` + server-side session checks gate `(portal)` and `(admin)`; UI hides forbidden actions but the backend is the enforcer
- No secrets in the frontend bundle; all third-party keys stay server-side or in the backend
- Strict CSP headers, sanitized rich-text rendering (CMS/blog content)

**Performance (PER-01…05)**
- Public pages: static + ISR revalidated via backend publish webhooks (`revalidateTag`); PPR on tour pages (static shell, dynamic availability slot)
- `next/image` for all media; skeletons + streaming for perceived speed; route-level code splitting keeps admin bundles out of the public site
- Infinite scroll / cursor pagination on all long lists (PER-05)
- Checkout buttons disable + idempotency keys on submission (PER-03)

**Reliability (REL-01…05)**
- Payment return page polls status and handles `pending` gracefully with clear messaging and support links (REL-02, REL-04)
- TanStack Query retry/backoff on transient API failures; global error boundary with recovery actions
- Offline PWA degrades gracefully: cached itineraries/tickets remain usable

**i18n & Accessibility (LNG, USE)**
- `next-intl` locale routing, RTL for Arabic (partially supported today), localized currency/date formatting; translated CMS content fetched per-locale
- Radix primitives for keyboard/screen-reader-safe dialogs, menus, tabs; WCAG AA contrast (existing design tokens are close); form errors adjacent to fields (USE-02)
- Step-progress indicator on the booking wizard (SRS §6.1)

---

## 7. Migration Plan for Existing Content

1. Hand `src/data/tour-001.ts` and `/public/images/day1…day10` to the backend team as seed data; frontend switches the tour page to the API and deletes the static file once parity is confirmed
2. Landing sections (testimonials, gallery, Ethiopia facts, features) become API/CMS-driven — same visuals, editable data
3. Replace the Google Translate widget with `next-intl`; extract existing strings into `messages/en.json` and `messages/ar.json`
4. The `tel:`/`mailto:` booking modal remains as a **secondary** "or book by phone" path — the market still expects it

---

## 8. Milestone Summary

| Phase | Weeks | Headline frontend deliverable |
|---|---|---|
| 0 — Foundation | 1–2 | API-driven site, auth pages, i18n scaffold, route groups |
| 1 — Booking & Checkout | 3–6 | Self-service tour booking wizard + gateway checkout |
| 2 — Admin UI | 6–10 | Staff runs the business without touching code |
| 3 — Engagement | 10–13 | Notifications, reviews, coupons, loyalty, support desk |
| 4 — Traveler Companion | 13–17 | Trip planner, PWA offline, QR tickets, tracking, SOS |
| 5 — Full Commerce | 17–22 | Hotels, transport, flights, unified cart, partner portal |
| 6 — Intelligence | 22+ | AI trip designer UI, live ops board, split pay |

**Definition of done per phase:** deployed, e2e-tested (Playwright covers the money paths against MSW + a staging-backend smoke run), feature-flagged rollout, SRS acceptance criteria for the covered modules verified.

---

## 9. Immediate Next Steps

1. **Contract-first kickoff with the backend team:** agree API conventions (pagination, errors, auth, locale, idempotency) and produce the Phase 0/1 OpenAPI draft — this unblocks everything
2. Set up client generation + MSW mocks from that spec so frontend work never waits on backend deployments
3. Restructure `app/` into route groups and scaffold auth pages
4. Extract i18n strings and stand up `next-intl` (removing the Google Translate widget)
5. Decide admin surface strategy (`/admin` route group in this repo vs. a separate admin frontend) — recommendation: route group here now; splitting later is cheap because all API access already goes through `lib/api/`
