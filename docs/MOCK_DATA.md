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

### Travel assistance & transfers
AS Tour helps travelers move **place to place effortlessly** — not only planning routes but coordinating every leg.

| Surface | Path |
|---|---|
| Search & book | `/transport` |
| Book route | `/transport/[routeId]` |
| My transfers | `/account/transport`, `/account/transport/[reference]` |
| From tour booking | **Arrange transfers** on `/account/bookings/[reference]` |
| Tour page | Included transfers + route legs on `/tours/tour-001` |
| Admin routes | `/admin/transport` |
| Confirm private legs | `/admin/transport/confirmations` |

**Modes:** flights, coaches, private transfers. Routes with `assistanceIncluded` get meet-and-greet, pickup times, and driver details.

**Tour-001 included transfers:** Airport → Addis, Addis → Bahir Dar, Bahir Dar → Gondar, Gondar → Lalibela.

Demo transfer bookings for `amina@example.com`: `TRN-2841` (confirmed), `TRN-2903` (pending staff confirmation).

### Travel booking designer (`/travel`, `/travel/design`)
**Separate from tours** — a simpler route planner for international and domestic travel. Stops are **country + city only** (no rich tour destination content).

| Trip type | Example |
|---|---|
| Travel to Ethiopia | Frankfurt → Addis → Lalibela → Frankfurt |
| Leave Ethiopia | Addis → Nairobi |
| Round trip international | Abroad ↔ Ethiopia |
| Domestic | Addis → Bahir Dar → Addis |
| Multi-country | Complex cross-border routes |

| Surface | Path |
|---|---|
| Overview | `/travel` |
| Design route | `/travel/design` |
| My plans | `/account/travel`, `/account/trips` |
| Admin quotes | `/admin/travel`, `/admin/travel/[id]` |

Submit for quote → staff sends price → confirm → book transfers via `/transport`.

Seed plans: `TRV-4821` (quoted round trip), `TRV-4902` (domestic draft), `TRV-5011` (submitted outbound).

## Wiring to real API

Replace `src/lib/hooks/use-travel-data.ts` fetchers with generated OpenAPI client calls. Keep the same query keys and component interfaces.
