# Traveler Management Module

> Frontend implementation guide for user authentication, traveler profiles, saved companions, wishlist, and the traveler account portal.
>
> Covers SRS Module 1 (AUTH-01…12) plus the account-portal surfaces other modules plug into (bookings list, trips, journal, notifications).
> Parent document: [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md) — this module ships in **Phase 0** (auth) and **Phase 1** (portal v1).

---

## 1. Purpose

Traveler Management is the identity backbone of the platform. Every other module depends on it:

- **Booking** needs a logged-in traveler with saved details (Business Rule 1: visitors must register before booking)
- **Payments** needs verified accounts and saved traveler info at checkout
- **Reviews, journal, trips, support** all hang off the traveler identity
- **Admin** manages the same user records from the other side

This repo implements the **frontend only**: pages, forms, session handling, and portal UI. Password hashing, token issuance, OAuth exchange, and data storage happen in the backend API.

---

## 2. Feature Scope

### 2.1 Authentication (SRS AUTH-01…07)

| Feature | SRS ID | Notes |
|---|---|---|
| Registration (name, email, phone, password) | AUTH-01 | Phone in international format, Ethiopian defaults (+251) with country picker |
| Client-side validation | AUTH-02 | Yup schema: email format, phone format, password strength meter, required fields |
| Social login (Google, Apple) | AUTH-03 | Buttons render only when the backend reports the provider is configured |
| Email verification | AUTH-04 | Post-register "check your inbox" screen + verification landing page + resend with cooldown |
| Login (email + password) | AUTH-05 | Unverified users get a "verify first" state with resend link |
| Remember me | AUTH-06 | Checkbox → backend issues long-lived session |
| Forgot / reset password | AUTH-07 | Request form → email link → reset form with the same password-strength rules |

### 2.2 Profile & Personal Data (AUTH-08…10, 12)

- Profile editor: name, photo (presigned upload + crop), nationality, preferred language, emergency contact
- Optional passport/ID section — clearly marked optional, explained why it speeds up booking; rendered as masked values once saved (backend stores encrypted)
- **Saved travelers / companions** (AUTH-09): CRUD list of family members and frequent co-travelers; these prefill the booking wizard's traveler-details step
- Saved payment methods (AUTH-10): display/delete only — actual storage is gateway tokenization, frontend never sees card numbers
- Account deactivation (AUTH-12): confirmation dialog explaining data retention policy, requires password re-entry

### 2.3 Wishlist (AUTH-11)

- Heart toggle on tour/hotel/destination cards and detail pages — optimistic update via TanStack Query mutation
- `/account/wishlist` page grouped by type, with price/availability freshness from the API
- Guest behavior: heart click prompts login with a `returnTo` redirect; wishlist intent preserved through the auth flow

### 2.4 Account Portal Shell

`/account` layout that later modules plug into:

- Sidebar/tab navigation: Overview, Bookings, Trips, Wishlist, Journal, Notifications, Profile, Security
- Overview dashboard: next upcoming trip card, recent bookings, loyalty points balance (Phase 3), quick actions
- Security page: change password, active sessions list with revoke, (later) 2FA enrollment
- Notification preferences page (channel toggles — wired fully in Phase 3)

---

## 3. Routes

```
src/app/
├── (marketing)/…                       # public pages (login-agnostic)
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── verify-email/page.tsx           # handles ?token= landing + resend state
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx         # handles ?token=
└── (portal)/account/
    ├── layout.tsx                      # portal shell, session-guarded
    ├── page.tsx                        # overview dashboard
    ├── profile/page.tsx
    ├── travelers/page.tsx              # saved companions CRUD
    ├── wishlist/page.tsx
    ├── security/page.tsx
    └── notifications/page.tsx          # preferences (Phase 3 wiring)
```

**Route protection:** `middleware.ts` checks the session cookie for everything under `(portal)`; unauthenticated users are redirected to `/auth/login?returnTo=<path>`. The layout re-verifies server-side (middleware is a fast path, not the enforcer).

---

## 4. Session & Auth Flow

```
Browser ──form submit──▶ BFF route handler (/api/auth/*)
                              │  forwards credentials
                              ▼
                         Backend API ── sets/returns session
                              │
Browser ◀──httpOnly cookie───┘  (cookie proxied by BFF; never readable by JS)
```

- Tokens live in an **httpOnly, same-site cookie** set through the BFF proxy — never in localStorage, never in client JS
- Server Components read the session via a `getSession()` helper in `lib/auth/`; client components get a minimal `useSession()` (name, avatar, roles) hydrated from the server — no token exposure
- Logout clears the cookie via BFF and invalidates the session server-side
- OAuth: frontend redirects to the backend's OAuth start URL; backend handles the provider exchange and redirects back with the session cookie set
- 401 responses from the API trigger a global redirect to login with `returnTo`

---

## 5. State, Forms, Validation

Per the project stack (see `IMPLEMENTATION_PLAN.md` §2.2):

| Concern | Tool | Usage here |
|---|---|---|
| Server state | **TanStack Query** | `profile`, `savedTravelers`, `wishlist`, `sessions` queries; mutations with optimistic updates (wishlist toggle, companion edits) |
| UI state | **Zustand** | Auth modal open state, wishlist intent-after-login, portal sidebar state (`lib/stores/`) |
| Forms | **Formik** | All auth and profile forms |
| Validation | **Yup** (`lib/schemas/traveler.ts`) | Schemas mirror the API DTOs; shared between register/profile/companion forms |

Yup schema conventions for this module:

```ts
// lib/schemas/traveler.ts (illustrative)
export const passwordSchema = yup.string().min(8).matches(UPPER).matches(DIGIT);
export const phoneSchema = yup.string().matches(E164_REGEX);
export const registerSchema = yup.object({ fullName, email, phone: phoneSchema, password: passwordSchema, confirmPassword });
export const companionSchema = yup.object({ fullName, dateOfBirth, nationality, passportNumber: yup.string().optional() });
```

Server errors (email taken, weak password by backend policy, invalid token) map onto Formik field errors via the API's error envelope (`fields` object) — never shown as generic toasts when a field is identifiable.

---

## 6. API Endpoints Consumed

From the backend OpenAPI spec (generated client in `lib/api/`):

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/verify-email`, `POST /auth/resend-verification`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `GET /auth/oauth/{provider}/start` |
| Session | `GET /me`, `GET /me/sessions`, `DELETE /me/sessions/{id}` |
| Profile | `GET/PATCH /me/profile`, `POST /media/presign` (avatar), `POST /me/deactivate`, `PATCH /me/password` |
| Companions | `GET/POST /me/travelers`, `PATCH/DELETE /me/travelers/{id}` |
| Wishlist | `GET /me/wishlist`, `PUT/DELETE /me/wishlist/{type}/{id}` |
| Payment methods | `GET /me/payment-methods`, `DELETE /me/payment-methods/{id}` |
| Preferences | `GET/PATCH /me/notification-preferences` |

Until these land in the backend, develop against **MSW mocks** in `src/mocks/` generated from the spec draft.

---

## 7. UX Requirements

- **Validation messages next to fields** (SRS USE-02, §6.1) — Formik field-level errors, not toast dumps
- **Password strength meter** on register/reset with plain-language hints
- **Phone input** with country flag picker, defaulting to +251 with Saudi (+966) prominent (current customer base)
- **Auth pages match brand:** reuse existing design tokens, motion, and imagery — auth is part of the marketing funnel, not an afterthought
- **i18n:** all strings via `next-intl` (EN/AM/AR at minimum); RTL-safe layouts for Arabic
- **Accessibility:** labeled inputs, error `aria-describedby`, focus management on step/state changes, keyboard-complete flows
- **Mobile-first:** these pages will be used mid-booking on phones; forms must be thumb-friendly with correct input modes (`inputmode="tel"`, `type="email"`)

---

## 8. Security Notes (Frontend Slice)

- No tokens in JS-readable storage — httpOnly cookies only (SEC-01)
- UI hides role-gated actions but the backend is the enforcer (SEC-02); never trust client role checks
- Passport/ID values rendered masked (`•••• 1234`) after save; full value only shown on explicit reveal action which re-hits the API (SEC-07)
- Rate-limit feedback: login/reset forms surface the backend's `429` state with a countdown instead of a generic failure (supports SEC-05 brute-force protection)
- Password fields: `autocomplete="new-password"` / `"current-password"` set correctly so password managers work

---

## 9. Delivery Checklist

**Phase 0 (auth core)**
- [ ] Yup schemas + Formik form kit (field, error, submit-state patterns) reusable by later modules
- [ ] Register / login / verify / forgot / reset pages
- [ ] BFF auth proxy routes + session helpers (`getSession`, `useSession`)
- [ ] `middleware.ts` portal guard with `returnTo`
- [ ] MSW handlers for all auth endpoints
- [ ] Playwright: register→verify→login happy path, wrong-password, expired-token flows

**Phase 1 (portal v1)**
- [ ] `/account` shell + overview
- [ ] Profile editor with avatar upload
- [ ] Saved companions CRUD (feeds the booking wizard)
- [ ] Wishlist toggle + page, guest-intent handoff through login
- [ ] Security page: change password, session list/revoke

**Phase 3 additions**
- [ ] Notification preferences wiring
- [ ] Loyalty balance on overview
- [ ] Account deactivation flow

**Definition of done:** all AUTH-01…12 acceptance criteria pass; e2e money-path prerequisite (register → verify → login → reach checkout) is green in CI against MSW and against backend staging.
