# Mock Data & Demo Roles

Frontend-only mock layer for traveler and travel management modules. Data resets on full page reload.

## Demo login

| Email | Role | Portal |
|---|---|---|
| `amina@example.com` | Traveler | `/account` |
| `sekina@astourtravel.com` | Administrator | `/admin` |
| `dawit@astourtravel.com` | Staff | `/admin` |
| `hana@astourtravel.com` | Support Agent | `/admin/support` |
| `elias@astourtravel.com` | Content Manager | `/admin/destinations` |
| `partner@bluenilehotel.et` | Partner | `/admin/partner` |

**Password (all accounts):** `Demo1234`

Use the **Demo role switch** in the sidebar footer to swap accounts without re-login.

## Architecture

```
src/lib/types/          Domain TypeScript types
src/lib/mock/seed.ts    Initial seed data
src/lib/mock/db.ts      In-memory store + mutation helpers
src/lib/hooks/          TanStack Query hooks (mock API)
src/lib/stores/auth.ts  Session (Zustand persist)
src/lib/auth/permissions.ts  Role → admin nav sections
```

## Implemented surfaces

### Traveler (`/account/*`)
Overview, bookings (+ detail), profile, saved travelers, wishlist, trips, journal, notifications, security

### Auth (`/auth/*`)
Login, register, verify email, forgot/reset password

### Admin (role-filtered nav)
Overview, bookings, payments, tours, hotels, transport, attraction tickets, destinations, promotions, reviews, blog, reports, customers, support (+ ticket thread), partner inventory, users & roles, settings

## Wiring to real API

Replace `src/lib/hooks/use-travel-data.ts` fetchers with generated OpenAPI client calls. Keep the same query keys and component interfaces.
