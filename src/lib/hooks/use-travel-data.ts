import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
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
  TourProduct,
  TransportRoute,
  TravelerProfile,
  TripPlan,
  User,
  WishlistItem,
} from "@/lib/types";
import {
  addJournalEntry,
  addSavedTraveler,
  addSupportMessage,
  getBookingsForUser,
  getBookingByRef,
  getDeparturesForTour,
  getHotelRooms,
  getTicketMessages,
  markAllNotificationsRead,
  markNotificationRead,
  mockDb,
  mockFetch,
  nextId,
  removeSavedTraveler,
  removeWishlistItem,
  updateBlogPost,
  updateBooking,
  updateDestination,
  updateNotificationPrefs,
  updatePromotion,
  updateReview,
  updateSavedTraveler,
  updateSettings,
  updateSupportTicket,
  updateTour,
  upsertProfile,
} from "@/lib/mock/db";
import { ALL_TRAVELERS } from "@/lib/mock/seed";
import { useCurrentUser } from "@/lib/stores/auth";

export const queryKeys = {
  bookings: (userId?: string) => ["bookings", userId] as const,
  booking: (ref: string) => ["booking", ref] as const,
  allBookings: ["bookings", "all"] as const,
  payments: ["payments"] as const,
  tours: ["tours"] as const,
  tour: (id: string) => ["tours", id] as const,
  customers: ["customers"] as const,
  profile: (userId: string) => ["profile", userId] as const,
  savedTravelers: (userId: string) => ["savedTravelers", userId] as const,
  wishlist: (userId: string) => ["wishlist", userId] as const,
  trips: (userId: string) => ["trips", userId] as const,
  journal: (userId: string) => ["journal", userId] as const,
  notifications: (userId: string) => ["notifications", userId] as const,
  notificationPrefs: (userId: string) => ["notificationPrefs", userId] as const,
  supportTickets: ["supportTickets"] as const,
  supportTicket: (id: string) => ["supportTicket", id] as const,
  ticketMessages: (ticketId: string) => ["ticketMessages", ticketId] as const,
  destinations: ["destinations"] as const,
  hotels: ["hotels"] as const,
  hotelRooms: (hotelId: string) => ["hotelRooms", hotelId] as const,
  transport: ["transport"] as const,
  attractionTickets: ["attractionTickets"] as const,
  promotions: ["promotions"] as const,
  reviews: ["reviews"] as const,
  blogPosts: ["blogPosts"] as const,
  settings: ["settings"] as const,
  adminStats: ["adminStats"] as const,
};

// ── Bookings ──

export function useMyBookings() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.bookings(user?.id),
    queryFn: () => mockFetch(getBookingsForUser(user!.id)),
    enabled: Boolean(user),
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: queryKeys.allBookings,
    queryFn: () => mockFetch(mockDb.bookings),
  });
}

export function useBooking(reference: string) {
  return useQuery({
    queryKey: queryKeys.booking(reference),
    queryFn: () => {
      const b = getBookingByRef(reference);
      if (!b) throw new Error("Booking not found");
      return mockFetch(b);
    },
    enabled: Boolean(reference),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const updated = updateBooking(id, { status: "cancelled" });
      if (!updated) throw new Error("Not found");
      await mockFetch(updated);
      return updated;
    },
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: queryKeys.allBookings });
      qc.invalidateQueries({ queryKey: queryKeys.bookings(b.userId) });
      qc.invalidateQueries({ queryKey: queryKeys.booking(b.reference) });
    },
  });
}

export function useConfirmBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const updated = updateBooking(id, {
        status: "confirmed",
        paymentStatus: "successful",
      });
      if (!updated) throw new Error("Not found");
      return mockFetch(updated);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.allBookings }),
  });
}

// ── Tours ──

export function useTours() {
  return useQuery({
    queryKey: queryKeys.tours,
    queryFn: () => mockFetch(mockDb.tours),
  });
}

export function useTour(id: string) {
  return useQuery({
    queryKey: queryKeys.tour(id),
    queryFn: async () => {
      const tour = mockDb.tours.find((t) => t.id === id);
      if (!tour) throw new Error("Tour not found");
      const departures = getDeparturesForTour(id);
      return mockFetch({ tour, departures });
    },
    enabled: Boolean(id),
  });
}

export function useUpdateTourStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: TourProduct["status"];
    }) => mockFetch(updateTour(id, { status })!),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tours }),
  });
}

// ── Payments & customers ──

export function usePayments() {
  return useQuery({
    queryKey: queryKeys.payments,
    queryFn: () => mockFetch(mockDb.payments),
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: () => mockFetch(ALL_TRAVELERS),
  });
}

// ── Profile & saved travelers ──

export function useSavedTravelers() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.savedTravelers(user?.id ?? ""),
    queryFn: () =>
      mockFetch(mockDb.savedTravelers.filter((t) => t.userId === user!.id)),
    enabled: Boolean(user),
  });
}

export function useSaveTraveler() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<SavedTraveler, "id" | "userId"> & { id?: string },
    ) => {
      if (data.id) {
        const updated = updateSavedTraveler(data.id, data);
        return mockFetch(updated!);
      }
      const created = addSavedTraveler({
        ...data,
        id: nextId("st"),
        userId: user!.id,
      });
      return mockFetch(created);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.savedTravelers(user!.id) }),
  });
}

export function useDeleteTraveler() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      removeSavedTraveler(id);
      return mockFetch(null);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.savedTravelers(user!.id) }),
  });
}

export function useUpdateProfile() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<TravelerProfile>) => {
      const base = mockDb.profiles.find((p) => p.userId === user!.id) ?? {
        userId: user!.id,
        nationality: "",
        preferredLanguage: "en" as const,
      };
      const updated = { ...base, ...patch };
      upsertProfile(updated);
      return mockFetch(updated);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.profile(user!.id) }),
  });
}

// ── Wishlist, trips, journal ──

export function useWishlist() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.wishlist(user?.id ?? ""),
    queryFn: () =>
      mockFetch(mockDb.wishlist.filter((w) => w.userId === user!.id)),
    enabled: Boolean(user),
  });
}

export function useRemoveWishlistItem() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      removeWishlistItem(id);
      return mockFetch(null);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.wishlist(user!.id) }),
  });
}

export function useTrips() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.trips(user?.id ?? ""),
    queryFn: () => mockFetch(mockDb.trips.filter((t) => t.userId === user!.id)),
    enabled: Boolean(user),
  });
}

export function useJournal() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.journal(user?.id ?? ""),
    queryFn: () =>
      mockFetch(mockDb.journal.filter((j) => j.userId === user!.id)),
    enabled: Boolean(user),
  });
}

export function useAddJournalEntry() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<JournalEntry, "id" | "userId" | "createdAt" | "photoCount">) => {
      const entry = addJournalEntry({
        ...data,
        id: nextId("jrnl"),
        userId: user!.id,
        createdAt: new Date().toISOString(),
        photoCount: 0,
      });
      return mockFetch(entry);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.journal(user!.id) }),
  });
}

// ── Notifications ──

export function useNotifications() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.notifications(user?.id ?? ""),
    queryFn: () =>
      mockFetch(mockDb.notifications.filter((n) => n.userId === user!.id)),
    enabled: Boolean(user),
  });
}

export function useNotificationPrefs() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.notificationPrefs(user?.id ?? ""),
    queryFn: () => mockFetch({ ...mockDb.notificationPrefs, userId: user!.id }),
    enabled: Boolean(user),
  });
}

export function useMarkNotificationRead() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      markNotificationRead(id);
      return mockFetch(null);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notifications(user!.id) }),
  });
}

export function useMarkAllNotificationsRead() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      markAllNotificationsRead(user!.id);
      return mockFetch(null);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notifications(user!.id) }),
  });
}

export function useUpdateNotificationPrefs() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (prefs: Partial<NotificationPreferences>) => {
      const updated = { ...mockDb.notificationPrefs, ...prefs, userId: user!.id };
      updateNotificationPrefs(updated);
      return mockFetch(updated);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notificationPrefs(user!.id) }),
  });
}

// ── Support ──

export function useSupportTickets() {
  return useQuery({
    queryKey: queryKeys.supportTickets,
    queryFn: () => mockFetch(mockDb.supportTickets),
  });
}

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.supportTicket(id),
    queryFn: async () => {
      const ticket = mockDb.supportTickets.find((t) => t.id === id);
      if (!ticket) throw new Error("Ticket not found");
      return mockFetch(ticket);
    },
    enabled: Boolean(id),
  });
}

export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.ticketMessages(ticketId),
    queryFn: () => mockFetch(getTicketMessages(ticketId)),
    enabled: Boolean(ticketId),
  });
}

export function useReplyToTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      body,
      authorName,
      authorRole,
    }: {
      ticketId: string;
      body: string;
      authorName: string;
      authorRole: SupportMessage["authorRole"];
    }) => {
      const msg = addSupportMessage({
        id: nextId("msg"),
        ticketId,
        body,
        authorName,
        authorRole,
        createdAt: new Date().toISOString(),
      });
      updateSupportTicket(ticketId, { status: "in_progress" });
      return mockFetch(msg);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.supportTickets });
      qc.invalidateQueries({ queryKey: queryKeys.supportTicket(vars.ticketId) });
      qc.invalidateQueries({ queryKey: queryKeys.ticketMessages(vars.ticketId) });
    },
  });
}

export function useAssignTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      assigneeId,
      assigneeName,
    }: {
      id: string;
      assigneeId: string;
      assigneeName: string;
    }) => mockFetch(updateSupportTicket(id, { assigneeId, assigneeName, status: "in_progress" })!),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.supportTickets }),
  });
}

// ── Catalog & content ──

export function useDestinations() {
  return useQuery({
    queryKey: queryKeys.destinations,
    queryFn: () => mockFetch(mockDb.destinations),
  });
}

export function useUpdateDestinationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Destination["status"];
    }) => mockFetch(updateDestination(id, { status })!),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.destinations }),
  });
}

export function useHotels() {
  return useQuery({
    queryKey: queryKeys.hotels,
    queryFn: () => mockFetch(mockDb.hotels),
  });
}

export function useHotelRooms(hotelId: string) {
  return useQuery({
    queryKey: queryKeys.hotelRooms(hotelId),
    queryFn: () => mockFetch(getHotelRooms(hotelId)),
    enabled: Boolean(hotelId),
  });
}

export function usePartnerRooms(partnerId?: string) {
  return useQuery({
    queryKey: queryKeys.hotelRooms(partnerId ?? "partner"),
    queryFn: async () => {
      const hotel = mockDb.hotels.find((h) => h.partnerId === partnerId);
      if (!hotel) return mockFetch([] as HotelRoom[]);
      return mockFetch(getHotelRooms(hotel.id));
    },
    enabled: Boolean(partnerId),
  });
}

export function useTransportRoutes() {
  return useQuery({
    queryKey: queryKeys.transport,
    queryFn: () => mockFetch(mockDb.transportRoutes),
  });
}

export function useAttractionTickets() {
  return useQuery({
    queryKey: queryKeys.attractionTickets,
    queryFn: () => mockFetch(mockDb.attractionTickets),
  });
}

export function usePromotions() {
  return useQuery({
    queryKey: queryKeys.promotions,
    queryFn: () => mockFetch(mockDb.promotions),
  });
}

export function useUpdatePromotionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Promotion["status"];
    }) => mockFetch(updatePromotion(id, { status })!),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.promotions }),
  });
}

export function useReviews() {
  return useQuery({
    queryKey: queryKeys.reviews,
    queryFn: () => mockFetch(mockDb.reviews),
  });
}

export function useModerateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Review["status"];
    }) => mockFetch(updateReview(id, { status })!),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.reviews }),
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: queryKeys.blogPosts,
    queryFn: () => mockFetch(mockDb.blogPosts),
  });
}

export function useUpdateBlogStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: BlogPost["status"];
    }) => mockFetch(updateBlogPost(id, { status })!),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.blogPosts }),
  });
}

export function useAppSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => mockFetch(mockDb.settings),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<AppSettings>) =>
      mockFetch(updateSettings(patch)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.settings }),
  });
}

export interface AdminStats {
  totalRevenue: number;
  bookingCount: number;
  activeTravelers: number;
  pendingReviews: number;
  revenueByMonth: { month: string; revenue: number; bookings: number }[];
  bookingsByDestination: { destination: string; bookings: number }[];
  topTours: { name: string; sold: number; capacity: number }[];
}

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: async (): Promise<AdminStats> => {
      const bookings = mockDb.bookings;
      const confirmed = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "completed",
      );
      const totalRevenue = confirmed.reduce((s, b) => s + b.amountUsd, 0);

      const destMap = new Map<string, number>();
      bookings.forEach((b) => {
        const tour = mockDb.tours.find((t) => t.id === b.tourId);
        const dest = tour?.destination ?? "Other";
        if (b.status !== "cancelled" && b.status !== "failed") {
          destMap.set(dest, (destMap.get(dest) ?? 0) + 1);
        }
      });

      const topTours = mockDb.tours
        .map((t) => {
          const dep = mockDb.departures.find((d) => d.tourId === t.id);
          return {
            name: t.title,
            sold: dep?.seatsSold ?? 0,
            capacity: dep?.capacity ?? 0,
          };
        })
        .filter((t) => t.capacity > 0);

      const stats: AdminStats = {
        totalRevenue,
        bookingCount: bookings.length,
        activeTravelers: ALL_TRAVELERS.length,
        pendingReviews: mockDb.reviews.filter((r) => r.status === "pending")
          .length,
        revenueByMonth: [
          { month: "Jan", revenue: 5400, bookings: 3 },
          { month: "Feb", revenue: 8200, bookings: 4 },
          { month: "Mar", revenue: 14500, bookings: 7 },
          { month: "Apr", revenue: 11800, bookings: 6 },
          { month: "May", revenue: 19400, bookings: 10 },
          { month: "Jun", revenue: 26800, bookings: 14 },
          { month: "Jul", revenue: totalRevenue, bookings: bookings.length },
        ],
        bookingsByDestination: Array.from(destMap.entries())
          .map(([destination, count]) => ({ destination, bookings: count }))
          .sort((a, b) => b.bookings - a.bookings),
        topTours,
      };
      return mockFetch(stats);
    },
  });
}

export type { Booking, Payment, User, WishlistItem, TripPlan, Hotel, TransportRoute, AttractionTicket };
