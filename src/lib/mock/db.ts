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
  TravelPlan,
  TourBudget,
  TourExpense,
  User,
  WishlistItem,
} from "@/lib/types";
import {
  APP_SETTINGS,
  ATTRACTION_TICKETS,
  BLOG_POSTS,
  BOOKINGS,
  DEPARTURES,
  DESTINATIONS,
  HOTEL_ROOMS,
  HOTELS,
  JOURNAL,
  NOTIFICATIONS,
  NOTIFICATION_PREFS,
  PAYMENTS,
  PROFILES,
  PROMOTIONS,
  REVIEWS,
  SAVED_TRAVELERS,
  SUPPORT_MESSAGES,
  SUPPORT_TICKETS,
  TOURS,
  TRANSPORT_ROUTES,
  TRIPS,
  TOUR_BUDGETS,
  TOUR_EXPENSES,
  TOUR_INCLUDED_STAYS,
  INVENTORY_NIGHTS,
  HOTEL_BOOKINGS,
  TOUR_MEMORIES,
  CUSTOM_TOUR_REQUESTS,
  CUSTOM_TOUR_PROPOSALS,
  TOUR_ITINERARIES,
  TOUR_INCLUDED_TRANSFERS,
  TRANSPORT_BOOKINGS,
  TRAVEL_HUBS,
  TRAVEL_PLANS,
  WISHLIST,
} from "./seed";
import { computeTourFinancials } from "@/lib/tour-finance";

/** In-memory mutable store — resets on full page reload. */
function clone<T>(value: T): T {
  return structuredClone(value);
}

export const mockDb = {
  bookings: clone(BOOKINGS),
  payments: clone(PAYMENTS),
  tours: clone(TOURS),
  departures: clone(DEPARTURES),
  profiles: clone(PROFILES),
  savedTravelers: clone(SAVED_TRAVELERS),
  wishlist: clone(WISHLIST),
  trips: clone(TRIPS),
  journal: clone(JOURNAL),
  notifications: clone(NOTIFICATIONS),
  notificationPrefs: clone(NOTIFICATION_PREFS),
  supportTickets: clone(SUPPORT_TICKETS),
  supportMessages: clone(SUPPORT_MESSAGES),
  destinations: clone(DESTINATIONS),
  hotels: clone(HOTELS),
  hotelRooms: clone(HOTEL_ROOMS),
  transportRoutes: clone(TRANSPORT_ROUTES),
  attractionTickets: clone(ATTRACTION_TICKETS),
  promotions: clone(PROMOTIONS),
  reviews: clone(REVIEWS),
  blogPosts: clone(BLOG_POSTS),
  settings: clone(APP_SETTINGS),
  tourBudgets: clone(TOUR_BUDGETS),
  tourExpenses: clone(TOUR_EXPENSES),
  tourIncludedStays: clone(TOUR_INCLUDED_STAYS),
  inventoryNights: clone(INVENTORY_NIGHTS),
  hotelBookings: clone(HOTEL_BOOKINGS),
  tourMemories: clone(TOUR_MEMORIES),
  customTourRequests: clone(CUSTOM_TOUR_REQUESTS),
  customTourProposals: clone(CUSTOM_TOUR_PROPOSALS),
  tourItineraries: clone(TOUR_ITINERARIES),
  tourIncludedTransfers: clone(TOUR_INCLUDED_TRANSFERS),
  transportBookings: clone(TRANSPORT_BOOKINGS),
  travelHubs: clone(TRAVEL_HUBS),
  travelPlans: clone(TRAVEL_PLANS),
};

export type MockDb = typeof mockDb;

export function resetMockDb() {
  mockDb.bookings = clone(BOOKINGS);
  mockDb.payments = clone(PAYMENTS);
  mockDb.tours = clone(TOURS);
  mockDb.departures = clone(DEPARTURES);
  mockDb.profiles = clone(PROFILES);
  mockDb.savedTravelers = clone(SAVED_TRAVELERS);
  mockDb.wishlist = clone(WISHLIST);
  mockDb.trips = clone(TRIPS);
  mockDb.journal = clone(JOURNAL);
  mockDb.notifications = clone(NOTIFICATIONS);
  mockDb.notificationPrefs = clone({ ...NOTIFICATION_PREFS });
  mockDb.supportTickets = clone(SUPPORT_TICKETS);
  mockDb.supportMessages = clone(SUPPORT_MESSAGES);
  mockDb.destinations = clone(DESTINATIONS);
  mockDb.hotels = clone(HOTELS);
  mockDb.hotelRooms = clone(HOTEL_ROOMS);
  mockDb.transportRoutes = clone(TRANSPORT_ROUTES);
  mockDb.attractionTickets = clone(ATTRACTION_TICKETS);
  mockDb.promotions = clone(PROMOTIONS);
  mockDb.reviews = clone(REVIEWS);
  mockDb.blogPosts = clone(BLOG_POSTS);
  mockDb.settings = clone(APP_SETTINGS);
  mockDb.tourBudgets = clone(TOUR_BUDGETS);
  mockDb.tourExpenses = clone(TOUR_EXPENSES);
  mockDb.tourIncludedStays = clone(TOUR_INCLUDED_STAYS);
  mockDb.inventoryNights = clone(INVENTORY_NIGHTS);
  mockDb.hotelBookings = clone(HOTEL_BOOKINGS);
  mockDb.tourMemories = clone(TOUR_MEMORIES);
  mockDb.customTourRequests = clone(CUSTOM_TOUR_REQUESTS);
  mockDb.customTourProposals = clone(CUSTOM_TOUR_PROPOSALS);
  mockDb.tourItineraries = clone(TOUR_ITINERARIES);
  mockDb.tourIncludedTransfers = clone(TOUR_INCLUDED_TRANSFERS);
  mockDb.transportBookings = clone(TRANSPORT_BOOKINGS);
  mockDb.travelHubs = clone(TRAVEL_HUBS);
  mockDb.travelPlans = clone(TRAVEL_PLANS);
}

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));

export async function mockFetch<T>(data: T, ms?: number): Promise<T> {
  await delay(ms);
  return clone(data);
}

export function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function findProfile(userId: string): TravelerProfile | undefined {
  return mockDb.profiles.find((p) => p.userId === userId);
}

export function upsertProfile(profile: TravelerProfile) {
  const idx = mockDb.profiles.findIndex((p) => p.userId === profile.userId);
  if (idx >= 0) mockDb.profiles[idx] = profile;
  else mockDb.profiles.push(profile);
}

export function getBookingsForUser(userId: string): Booking[] {
  return mockDb.bookings.filter((b) => b.userId === userId);
}

export function getBookingByRef(reference: string): Booking | undefined {
  return mockDb.bookings.find((b) => b.reference === reference);
}

export function updateBooking(id: string, patch: Partial<Booking>): Booking | null {
  const idx = mockDb.bookings.findIndex((b) => b.id === id);
  if (idx < 0) return null;
  mockDb.bookings[idx] = { ...mockDb.bookings[idx]!, ...patch };
  return mockDb.bookings[idx]!;
}

export function addSavedTraveler(traveler: SavedTraveler) {
  mockDb.savedTravelers.push(traveler);
  return traveler;
}

export function updateSavedTraveler(id: string, patch: Partial<SavedTraveler>) {
  const idx = mockDb.savedTravelers.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  mockDb.savedTravelers[idx] = { ...mockDb.savedTravelers[idx]!, ...patch };
  return mockDb.savedTravelers[idx]!;
}

export function removeSavedTraveler(id: string) {
  mockDb.savedTravelers = mockDb.savedTravelers.filter((t) => t.id !== id);
}

export function removeWishlistItem(id: string) {
  mockDb.wishlist = mockDb.wishlist.filter((w) => w.id !== id);
}

export function markNotificationRead(id: string) {
  const n = mockDb.notifications.find((x) => x.id === id);
  if (n) n.read = true;
}

export function markAllNotificationsRead(userId: string) {
  mockDb.notifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
}

export function updateNotificationPrefs(prefs: NotificationPreferences) {
  mockDb.notificationPrefs = prefs;
}

export function addJournalEntry(entry: JournalEntry) {
  mockDb.journal.unshift(entry);
  return entry;
}

export function updateSupportTicket(id: string, patch: Partial<SupportTicket>) {
  const idx = mockDb.supportTickets.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  mockDb.supportTickets[idx] = {
    ...mockDb.supportTickets[idx]!,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return mockDb.supportTickets[idx]!;
}

export function getTicketMessages(ticketId: string): SupportMessage[] {
  return mockDb.supportMessages.filter((m) => m.ticketId === ticketId);
}

export function addSupportMessage(msg: SupportMessage) {
  mockDb.supportMessages.push(msg);
  const ticket = mockDb.supportTickets.find((t) => t.id === msg.ticketId);
  if (ticket) {
    ticket.messageCount += 1;
    ticket.updatedAt = msg.createdAt;
  }
  return msg;
}

export function updateTour(id: string, patch: Partial<TourProduct>) {
  const idx = mockDb.tours.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  mockDb.tours[idx] = { ...mockDb.tours[idx]!, ...patch };
  return mockDb.tours[idx]!;
}

export function getDeparturesForTour(tourId: string): TourDeparture[] {
  return mockDb.departures.filter((d) => d.tourId === tourId);
}

export function getHotelRooms(hotelId: string): HotelRoom[] {
  return mockDb.hotelRooms.filter((r) => r.hotelId === hotelId);
}

export function updateReview(id: string, patch: Partial<Review>) {
  const idx = mockDb.reviews.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  mockDb.reviews[idx] = { ...mockDb.reviews[idx]!, ...patch };
  return mockDb.reviews[idx]!;
}

export function updatePromotion(id: string, patch: Partial<Promotion>) {
  const idx = mockDb.promotions.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  mockDb.promotions[idx] = { ...mockDb.promotions[idx]!, ...patch };
  return mockDb.promotions[idx]!;
}

export function updateBlogPost(id: string, patch: Partial<BlogPost>) {
  const idx = mockDb.blogPosts.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  mockDb.blogPosts[idx] = { ...mockDb.blogPosts[idx]!, ...patch };
  return mockDb.blogPosts[idx]!;
}

export function updateSettings(patch: Partial<AppSettings>) {
  mockDb.settings = { ...mockDb.settings, ...patch };
  return mockDb.settings;
}

export function updateDestination(id: string, patch: Partial<Destination>) {
  const idx = mockDb.destinations.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  mockDb.destinations[idx] = { ...mockDb.destinations[idx]!, ...patch };
  return mockDb.destinations[idx]!;
}

export function getTourBudget(tourId: string): TourBudget | undefined {
  return mockDb.tourBudgets.find((b) => b.tourId === tourId);
}

export function updateTourBudget(budget: TourBudget) {
  const idx = mockDb.tourBudgets.findIndex((b) => b.tourId === budget.tourId);
  if (idx >= 0) mockDb.tourBudgets[idx] = budget;
  else mockDb.tourBudgets.push(budget);
  return budget;
}

export function getTourExpenses(tourId: string): TourExpense[] {
  return mockDb.tourExpenses.filter((e) => e.tourId === tourId);
}

export function addTourExpense(expense: TourExpense) {
  mockDb.tourExpenses.unshift(expense);
  return expense;
}

export function removeTourExpense(id: string) {
  mockDb.tourExpenses = mockDb.tourExpenses.filter((e) => e.id !== id);
}

export function getTourFinancialSummary(tourId: string) {
  const budget = getTourBudget(tourId);
  return computeTourFinancials(
    tourId,
    mockDb.bookings,
    mockDb.tourExpenses,
    budget,
  );
}

export function getAllTourFinancialSummaries() {
  return mockDb.tours.map((t) => getTourFinancialSummary(t.id));
}

export type { User, Booking, Payment, TourProduct, SavedTraveler, WishlistItem };
