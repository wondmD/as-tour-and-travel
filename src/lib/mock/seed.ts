import type {
  AppNotification,
  AppSettings,
  AttractionTicket,
  BlogPost,
  Booking,
  Destination,
  Hotel,
  HotelRoom,
  JournalEntry,
  NotificationPreferences,
  Payment,
  Promotion,
  Review,
  SavedTraveler,
  SupportMessage,
  SupportTicket,
  TourDeparture,
  TourProduct,
  TransportRoute,
  TravelerProfile,
  TripPlan,
  User,
  WishlistItem,
} from "@/lib/types";

/** Demo accounts — one per role. Password for all: `Demo1234` (mock only). */
export const DEMO_USERS: User[] = [
  {
    id: "usr-traveler-1",
    email: "amina@example.com",
    phone: "+251911234567",
    fullName: "Amina Kedir",
    role: "traveler",
    emailVerified: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "usr-admin-1",
    email: "sekina@astourtravel.com",
    phone: "+966509357925",
    fullName: "Sekina Fedill",
    role: "admin",
    emailVerified: true,
    createdAt: "2025-06-01T08:00:00Z",
  },
  {
    id: "usr-staff-1",
    email: "dawit@astourtravel.com",
    phone: "+251911000001",
    fullName: "Dawit Alemu",
    role: "staff",
    emailVerified: true,
    createdAt: "2025-08-10T09:00:00Z",
  },
  {
    id: "usr-support-1",
    email: "hana@astourtravel.com",
    phone: "+251911000002",
    fullName: "Hana Bekele",
    role: "support_agent",
    emailVerified: true,
    createdAt: "2025-09-01T09:00:00Z",
  },
  {
    id: "usr-content-1",
    email: "elias@astourtravel.com",
    phone: "+251911000003",
    fullName: "Elias Tadesse",
    role: "content_manager",
    emailVerified: true,
    createdAt: "2025-09-15T09:00:00Z",
  },
  {
    id: "usr-partner-1",
    email: "partner@bluenilehotel.et",
    phone: "+251582111111",
    fullName: "Tigist Haile",
    role: "partner",
    partnerName: "Blue Nile Hotel",
    emailVerified: true,
    createdAt: "2025-10-01T09:00:00Z",
  },
];

export const DEMO_PASSWORD = "Demo1234";

export const PROFILES: TravelerProfile[] = [
  {
    userId: "usr-traveler-1",
    nationality: "Ethiopian",
    preferredLanguage: "en",
    dateOfBirth: "1992-04-18",
    gender: "female",
    emergencyContactName: "Kedir Mohammed",
    emergencyContactPhone: "+251922345678",
    passportNumber: "EP1234567",
    passportCountry: "Ethiopia",
    passportExpiry: "2028-06-30",
  },
];

export const SAVED_TRAVELERS: SavedTraveler[] = [
  {
    id: "st-1",
    userId: "usr-traveler-1",
    fullName: "Kedir Mohammed",
    dateOfBirth: "1990-08-12",
    nationality: "Ethiopian",
    gender: "male",
    relationship: "Spouse",
    passportNumber: "EP7654321",
  },
  {
    id: "st-2",
    userId: "usr-traveler-1",
    fullName: "Sara Kedir",
    dateOfBirth: "2018-03-05",
    nationality: "Ethiopian",
    gender: "female",
    relationship: "Child",
  },
];

export const TOURS: TourProduct[] = [
  {
    id: "tour-001",
    slug: "tour-001",
    title: "Historic North Circuit",
    destination: "Ethiopia",
    durationDays: 10,
    basePriceUsd: 1390,
    coverImage: "/images/day1/hero.jpg",
    status: "published",
    rating: 4.9,
    reviewCount: 47,
    category: "Cultural",
  },
  {
    id: "tour-002",
    slug: "danakil-expedition",
    title: "Danakil Expedition",
    destination: "Afar Region",
    durationDays: 4,
    basePriceUsd: 1150,
    coverImage: "/images/stock/ethiopia-landscape.jpg",
    status: "published",
    rating: 4.7,
    reviewCount: 28,
    category: "Adventure",
  },
  {
    id: "tour-003",
    slug: "simien-trek",
    title: "Simien Mountains Trek",
    destination: "Amhara",
    durationDays: 6,
    basePriceUsd: 990,
    coverImage: "/images/stock/mountain.jpg",
    status: "published",
    rating: 4.8,
    reviewCount: 19,
    category: "Trekking",
  },
  {
    id: "tour-004",
    slug: "omo-valley",
    title: "Omo Valley Culture",
    destination: "Southern Nations",
    durationDays: 8,
    basePriceUsd: 1140,
    coverImage: "/images/stock/culture.jpg",
    status: "draft",
    rating: 4.6,
    reviewCount: 11,
    category: "Cultural",
  },
];

export const DEPARTURES: TourDeparture[] = [
  { id: "dep-1", tourId: "tour-001", date: "2026-08-14", capacity: 20, seatsSold: 14, priceUsd: 1390 },
  { id: "dep-2", tourId: "tour-001", date: "2026-09-11", capacity: 20, seatsSold: 8, priceUsd: 1390 },
  { id: "dep-3", tourId: "tour-002", date: "2026-09-02", capacity: 12, seatsSold: 11, priceUsd: 1150 },
  { id: "dep-4", tourId: "tour-003", date: "2026-07-25", capacity: 15, seatsSold: 15, priceUsd: 990 },
];

export const BOOKINGS: Booking[] = [
  {
    id: "bkg-1",
    reference: "AST-1042",
    userId: "usr-traveler-1",
    tourId: "tour-001",
    tourTitle: "Historic North Circuit",
    departureId: "dep-1",
    departureDate: "2026-08-14",
    travelers: [
      { fullName: "Amina Kedir", dateOfBirth: "1992-04-18", nationality: "Ethiopian" },
      { fullName: "Kedir Mohammed", dateOfBirth: "1990-08-12", nationality: "Ethiopian" },
    ],
    travelerCount: 2,
    amountUsd: 2780,
    status: "confirmed",
    paymentStatus: "successful",
    createdAt: "2026-06-20T14:30:00Z",
    specialRequests: "Vegetarian meals for both travelers",
    cancellationPolicy: "Free cancellation up to 14 days before departure. 90% refund within 7 days.",
  },
  {
    id: "bkg-2",
    reference: "AST-1035",
    userId: "usr-traveler-1",
    tourId: "tour-002",
    tourTitle: "Danakil Expedition",
    departureId: "dep-3",
    departureDate: "2026-09-02",
    travelers: [{ fullName: "Amina Kedir" }],
    travelerCount: 1,
    amountUsd: 1150,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2026-07-01T09:15:00Z",
    cancellationPolicy: "50% refund if cancelled 21+ days before departure.",
  },
  {
    id: "bkg-3",
    reference: "AST-1028",
    userId: "usr-traveler-1",
    tourId: "tour-001",
    tourTitle: "Historic North Circuit",
    departureId: "dep-2",
    departureDate: "2025-11-10",
    travelers: [{ fullName: "Amina Kedir" }],
    travelerCount: 1,
    amountUsd: 1390,
    status: "completed",
    paymentStatus: "successful",
    createdAt: "2025-09-01T11:00:00Z",
    cancellationPolicy: "Free cancellation up to 14 days before departure.",
  },
  {
    id: "bkg-4",
    reference: "AST-1041",
    userId: "usr-traveler-2",
    tourId: "tour-001",
    tourTitle: "Historic North Circuit",
    departureId: "dep-1",
    departureDate: "2026-08-14",
    travelers: [
      { fullName: "Mohammed Al-Rashid" },
      { fullName: "Fatima Hassan" },
      { fullName: "Omar Al-Rashid" },
      { fullName: "Layla Al-Rashid" },
    ],
    travelerCount: 4,
    amountUsd: 5560,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2026-07-05T16:00:00Z",
    cancellationPolicy: "Free cancellation up to 14 days before departure.",
  },
];

export const PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    bookingReference: "AST-1042",
    userId: "usr-traveler-1",
    customerName: "Amina Kedir",
    amountUsd: 2780,
    method: "telebirr",
    status: "successful",
    createdAt: "2026-06-20T14:35:00Z",
  },
  {
    id: "pay-2",
    bookingReference: "AST-1035",
    userId: "usr-traveler-1",
    customerName: "Amina Kedir",
    amountUsd: 1150,
    method: "chapa",
    status: "pending",
    createdAt: "2026-07-01T09:20:00Z",
  },
  {
    id: "pay-3",
    bookingReference: "AST-1041",
    userId: "usr-traveler-2",
    customerName: "Mohammed Al-Rashid",
    amountUsd: 5560,
    method: "stripe",
    status: "pending",
    createdAt: "2026-07-05T16:05:00Z",
  },
];

export const WISHLIST: WishlistItem[] = [
  {
    id: "wl-1",
    userId: "usr-traveler-1",
    type: "tour",
    itemId: "tour-003",
    title: "Simien Mountains Trek",
    subtitle: "6 days · Amhara",
    priceFromUsd: 990,
    addedAt: "2026-06-10T12:00:00Z",
  },
  {
    id: "wl-2",
    userId: "usr-traveler-1",
    type: "destination",
    itemId: "lalibela",
    title: "Lalibela",
    subtitle: "Rock-hewn churches · Best Oct–Mar",
    addedAt: "2026-05-20T08:00:00Z",
  },
  {
    id: "wl-3",
    userId: "usr-traveler-1",
    type: "tour",
    itemId: "tour-004",
    title: "Omo Valley Culture",
    subtitle: "8 days · Southern Nations",
    priceFromUsd: 1140,
    addedAt: "2026-06-28T15:00:00Z",
  },
];

export const TRIPS: TripPlan[] = [
  {
    id: "trip-1",
    userId: "usr-traveler-1",
    name: "Ethiopia Summer 2026",
    startDate: "2026-08-14",
    endDate: "2026-08-24",
    itemCount: 10,
    status: "planning",
  },
  {
    id: "trip-2",
    userId: "usr-traveler-1",
    name: "Weekend in Bahir Dar",
    startDate: "2026-10-03",
    endDate: "2026-10-05",
    itemCount: 4,
    status: "planning",
  },
];

export const JOURNAL: JournalEntry[] = [
  {
    id: "jrnl-1",
    userId: "usr-traveler-1",
    tripId: "trip-1",
    title: "First glimpse of Lalibela",
    body: "The churches carved from rock are even more breathtaking than the photos. Our guide explained the history with such passion.",
    location: "Lalibela",
    isPublic: true,
    createdAt: "2025-11-12T18:00:00Z",
    photoCount: 6,
  },
  {
    id: "jrnl-2",
    userId: "usr-traveler-1",
    title: "Coffee ceremony at sunset",
    body: "Private note — want to repeat this experience on the next trip.",
    location: "Gondar",
    isPublic: false,
    createdAt: "2025-11-08T20:30:00Z",
    photoCount: 3,
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-1",
    userId: "usr-traveler-1",
    title: "Booking confirmed",
    body: "AST-1042 — Historic North Circuit, Aug 14. Your invoice is ready to download.",
    read: false,
    createdAt: "2026-06-20T14:40:00Z",
    category: "booking",
  },
  {
    id: "ntf-2",
    userId: "usr-traveler-1",
    title: "Payment pending",
    body: "Complete payment for AST-1035 within 20 minutes to hold your seat.",
    read: false,
    createdAt: "2026-07-01T09:20:00Z",
    category: "payment",
  },
  {
    id: "ntf-3",
    userId: "usr-traveler-1",
    title: "Trip reminder",
    body: "Your Historic North Circuit departure is in 37 days. Review your packing list.",
    read: true,
    createdAt: "2026-07-07T08:00:00Z",
    category: "reminder",
  },
];

export const NOTIFICATION_PREFS: NotificationPreferences = {
  userId: "usr-traveler-1",
  emailBooking: true,
  emailPromo: false,
  smsReminder: true,
  pushEnabled: true,
};

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "tkt-1",
    reference: "SUP-1088",
    userId: "usr-traveler-1",
    customerName: "Amina Kedir",
    subject: "Change traveler name on booking AST-1042",
    status: "in_progress",
    priority: "normal",
    assigneeId: "usr-support-1",
    assigneeName: "Hana Bekele",
    createdAt: "2026-07-06T10:00:00Z",
    updatedAt: "2026-07-07T09:30:00Z",
    messageCount: 4,
  },
  {
    id: "tkt-2",
    reference: "SUP-1085",
    userId: "usr-traveler-2",
    customerName: "Mohammed Al-Rashid",
    subject: "Group booking payment split",
    status: "open",
    priority: "high",
    createdAt: "2026-07-05T17:00:00Z",
    updatedAt: "2026-07-05T17:00:00Z",
    messageCount: 1,
  },
];

export const SUPPORT_MESSAGES: SupportMessage[] = [
  {
    id: "msg-1",
    ticketId: "tkt-1",
    authorName: "Amina Kedir",
    authorRole: "traveler",
    body: "I need to update the spelling on my companion's name — Kedir Mohammed should be Kedir Mohammad.",
    createdAt: "2026-07-06T10:00:00Z",
  },
  {
    id: "msg-2",
    ticketId: "tkt-1",
    authorName: "Hana Bekele",
    authorRole: "support_agent",
    body: "Hi Amina, I can help with that. Please confirm the passport matches the spelling 'Mohammad'.",
    createdAt: "2026-07-06T11:15:00Z",
  },
  {
    id: "msg-3",
    ticketId: "tkt-1",
    authorName: "Amina Kedir",
    authorRole: "traveler",
    body: "Yes, the passport shows Mohammad. Thank you!",
    createdAt: "2026-07-07T09:00:00Z",
  },
  {
    id: "msg-4",
    ticketId: "tkt-1",
    authorName: "Hana Bekele",
    authorRole: "support_agent",
    body: "Updated — you'll receive a revised confirmation email shortly.",
    createdAt: "2026-07-07T09:30:00Z",
  },
];

/** Extra customer for admin list (not a demo login). */
export const EXTRA_CUSTOMERS: User[] = [
  {
    id: "usr-traveler-2",
    email: "m.alrashid@example.com",
    phone: "+966501234567",
    fullName: "Mohammed Al-Rashid",
    role: "traveler",
    emailVerified: true,
    createdAt: "2026-03-10T12:00:00Z",
  },
  {
    id: "usr-traveler-3",
    email: "sara.t@example.com",
    phone: "+251933456789",
    fullName: "Sara Tesfaye",
    role: "traveler",
    emailVerified: true,
    createdAt: "2026-04-22T08:00:00Z",
  },
];

export const ALL_TRAVELERS: User[] = [
  ...DEMO_USERS.filter((u) => u.role === "traveler"),
  ...EXTRA_CUSTOMERS,
];

export const DESTINATIONS: Destination[] = [
  { id: "lalibela", name: "Lalibela", country: "Ethiopia", status: "published", bestSeason: "Oct–Mar", tourCount: 8 },
  { id: "gondar", name: "Gondar", country: "Ethiopia", status: "published", bestSeason: "Year-round", tourCount: 5 },
  { id: "bahir-dar", name: "Bahir Dar", country: "Ethiopia", status: "published", bestSeason: "Oct–Jun", tourCount: 6 },
  { id: "danakil", name: "Danakil Depression", country: "Ethiopia", status: "draft", bestSeason: "Nov–Feb", tourCount: 2 },
  { id: "simien", name: "Simien Mountains", country: "Ethiopia", status: "published", bestSeason: "Oct–Mar", tourCount: 4 },
];

export const HOTELS: Hotel[] = [
  { id: "htl-1", name: "Blue Nile Hotel", city: "Bahir Dar", stars: 4, partnerId: "usr-partner-1", partnerName: "Blue Nile Hotel", status: "active", roomTypes: 3, avgRateUsd: 115 },
  { id: "htl-2", name: "Goha Hotel", city: "Lalibela", stars: 3, status: "active", roomTypes: 2, avgRateUsd: 95 },
  { id: "htl-3", name: "Mayleko Lodge", city: "Gondar", stars: 4, status: "active", roomTypes: 4, avgRateUsd: 130 },
  { id: "htl-4", name: "Kuriftu Resort", city: "Langano", stars: 5, status: "pending", roomTypes: 5, avgRateUsd: 210 },
];

export const HOTEL_ROOMS: HotelRoom[] = [
  { id: "rm-1", hotelId: "htl-1", name: "Standard Double", rateUsd: 85, available: 12, total: 20 },
  { id: "rm-2", hotelId: "htl-1", name: "Deluxe Lake View", rateUsd: 140, available: 3, total: 8 },
  { id: "rm-3", hotelId: "htl-1", name: "Executive Suite", rateUsd: 220, available: 1, total: 4 },
  { id: "rm-4", hotelId: "htl-2", name: "Garden View", rateUsd: 90, available: 8, total: 14 },
  { id: "rm-5", hotelId: "htl-3", name: "Heritage Room", rateUsd: 125, available: 5, total: 10 },
];

export const TRANSPORT_ROUTES: TransportRoute[] = [
  { id: "tr-1", type: "flight", origin: "Addis Ababa (ADD)", destination: "Lalibela (LLI)", operator: "Ethiopian Airlines", durationMinutes: 75, priceFromUsd: 180, status: "active" },
  { id: "tr-2", type: "flight", origin: "Addis Ababa (ADD)", destination: "Bahir Dar (BJR)", operator: "Ethiopian Airlines", durationMinutes: 55, priceFromUsd: 120, status: "active" },
  { id: "tr-3", type: "bus", origin: "Addis Ababa", destination: "Gondar", operator: "Selam Bus", durationMinutes: 720, priceFromUsd: 35, status: "active" },
  { id: "tr-4", type: "private_car", origin: "Lalibela", destination: "Axum", operator: "AS Tour Fleet", durationMinutes: 480, priceFromUsd: 280, status: "seasonal" },
  { id: "tr-5", type: "bus", origin: "Mekele", destination: "Erta Ale", operator: "Danakil Transfers", durationMinutes: 300, priceFromUsd: 65, status: "inactive" },
];

export const ATTRACTION_TICKETS: AttractionTicket[] = [
  { id: "atk-1", name: "Lalibela Churches Pass", location: "Lalibela", category: "monument", priceUsd: 50, validDays: 3, status: "active" },
  { id: "atk-2", name: "Simien National Park Entry", location: "Debark", category: "park", priceUsd: 25, validDays: 1, status: "active" },
  { id: "atk-3", name: "National Museum Addis", location: "Addis Ababa", category: "museum", priceUsd: 8, validDays: 1, status: "active" },
  { id: "atk-4", name: "Timket Festival VIP", location: "Gondar", category: "event", priceUsd: 120, validDays: 1, status: "sold_out" },
];

export const PROMOTIONS: Promotion[] = [
  { id: "promo-1", code: "NORTH10", title: "North Circuit early bird", discountPercent: 10, validFrom: "2026-06-01", validUntil: "2026-08-31", uses: 14, maxUses: 50, status: "active" },
  { id: "promo-2", code: "SUMMER2026", title: "Summer travel sale", discountPercent: 15, validFrom: "2026-07-01", validUntil: "2026-09-30", uses: 8, maxUses: 100, status: "active" },
  { id: "promo-3", code: "GROUP5", title: "Group booking discount", discountPercent: 5, validFrom: "2026-08-01", validUntil: "2026-12-31", uses: 0, maxUses: 200, status: "scheduled" },
  { id: "promo-4", code: "WINTER25", title: "Winter 2025 promo", discountPercent: 20, validFrom: "2025-11-01", validUntil: "2026-01-31", uses: 42, maxUses: 42, status: "expired" },
];

export const REVIEWS: Review[] = [
  { id: "rev-1", tourId: "tour-001", tourTitle: "Historic North Circuit", authorName: "Amina Kedir", rating: 5, body: "An unforgettable journey through Ethiopia's history. Guides were excellent.", status: "approved", createdAt: "2025-11-15T10:00:00Z" },
  { id: "rev-2", tourId: "tour-002", tourTitle: "Danakil Expedition", authorName: "Sara Tesfaye", rating: 4, body: "Challenging but worth it. Bring sun protection.", status: "approved", createdAt: "2026-03-20T14:00:00Z" },
  { id: "rev-3", tourId: "tour-001", tourTitle: "Historic North Circuit", authorName: "Daniel Bekele", rating: 5, body: "Perfect organization from start to finish.", status: "pending", createdAt: "2026-07-06T09:00:00Z" },
  { id: "rev-4", tourId: "tour-003", tourTitle: "Simien Mountains Trek", authorName: "Fatima Hassan", rating: 3, body: "Beautiful scenery but accommodation could improve.", status: "pending", createdAt: "2026-07-07T11:30:00Z" },
  { id: "rev-5", tourId: "tour-002", tourTitle: "Danakil Expedition", authorName: "Spam User", rating: 1, body: "Buy cheap watches here!!!", status: "rejected", createdAt: "2026-06-01T08:00:00Z" },
];

export const BLOG_POSTS: BlogPost[] = [
  { id: "blog-1", slug: "lalibela-guide", title: "Complete guide to Lalibela", author: "Elias Tadesse", status: "published", publishedAt: "2026-05-10T08:00:00Z", views: 2840 },
  { id: "blog-2", slug: "ethiopian-coffee", title: "Ethiopian coffee ceremony explained", author: "Elias Tadesse", status: "published", publishedAt: "2026-06-02T10:00:00Z", views: 1520 },
  { id: "blog-3", slug: "packing-north-circuit", title: "What to pack for the North Circuit", author: "Elias Tadesse", status: "draft", views: 0 },
  { id: "blog-4", slug: "timket-festival", title: "Experiencing Timket in Gondar", author: "Elias Tadesse", status: "published", publishedAt: "2026-01-20T09:00:00Z", views: 4100 },
];

export const APP_SETTINGS: AppSettings = {
  companyName: "AS Tour & Travel",
  supportEmail: "support@astourtravel.com",
  defaultCurrency: "USD",
  bookingHoldMinutes: 20,
  cancellationGraceDays: 14,
  enableStripe: true,
  enableChapa: true,
  enableTelebirr: true,
  maintenanceMode: false,
};
