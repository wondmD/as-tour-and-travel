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
Overview, bookings, payments, **tour management (income/expense/budget P&L)**, **custom tour requests**, hotels, transport, attraction tickets, destinations, promotions, reviews, blog, reports, customers, support (+ ticket thread), partner inventory, users & roles, settings

### Tour types & departure memories
- **Types:** `group_departure`, `semi_private`, `private`, `custom`
- **Memories:** After a departure ends, non-private tours get a photo/video gallery (`tourTypeSupportsMemory` — private tours excluded)
- **Public:** `/tours/[slug]` shows type badge + memories section; `/tours/[slug]/memories` gallery
- **Traveler:** `/account/memories` — browse all published departure galleries

### Custom tour requests
Travelers pick destinations and submit a request; admin/staff confirm, reject, or send a customized proposal.

| Flow | Path | Role |
|---|---|---|
| Request custom tour | `/tours/request` | Traveler (login) |
| My requests | `/account/custom-tours`, `/account/custom-tours/[reference]` | Traveler |
| Admin queue | `/admin/custom-tours` | Admin, Staff |
| Review / proposal | `/admin/custom-tours/[id]` | Admin, Staff |
| Create for traveler | `/admin/custom-tours/new` | Admin, Staff |

**Request statuses:** `pending` → `under_review` → `proposal_sent` → `confirmed` | `rejected` | `cancelled`

Seed includes sample memories (Historic Route group departure), pending/review requests, and a staff-created custom tour (`tour-custom-1`).

### Tour financial tracking (`/admin/tours/[id]`)
- Income, expenses, budget, and P/L analysis per tour

### Tour design studio (`/admin/tours/new`, `/admin/tours/[id]/design`)
Visual itinerary builder (design-system style layout):

1. Set **tour start date** (Day 1 anchor)
2. Pick **destinations** from the published catalog
3. Assign each stop an **arrival date** and **nights**
4. Timeline auto-computes day numbers, departures, and total duration
5. **Save draft** or **Publish**

Seed itineraries exist for `tour-001` (Bahir Dar → Gondar → Lalibela) and `tour-custom-1`.

Demo: log in as `dawit@astourtravel.com` → `/admin/tours/new` or open **Design route** on any tour detail page.

### Hotels & housing
- **Public:** `/hotels` search, `/hotels/[id]` book (instant / on-request)
- **Traveler:** `/account/hotels` — stay history and status
- **Tour:** Included accommodation on `/tours/tour-001`
- **Admin:** `/admin/hotels`, `/admin/hotels/[id]` inventory, `/admin/hotels/confirmations` queue
- **Partner:** `/admin/partner` — allotment updates (Blue Nile Hotel)

Fulfillment types: `instant` (AS Tour apartments), `allotment` (partner blocks), `on_request` (staff confirms within SLA).

## Wiring to real API

Replace `src/lib/hooks/use-travel-data.ts` fetchers with generated OpenAPI client calls. Keep the same query keys and component interfaces.
