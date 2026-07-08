import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateHotelBookingInput } from "@/lib/mock/hotel-db";
import {
  confirmHotelBooking,
  createHotelBooking,
  declineHotelBooking,
  getHotelBookingByRef,
  getHotelBookingsForUser,
  getHotelById,
  getInventoryForProperty,
  getPendingHotelBookings,
  getTourIncludedStays,
  mockHotelFetch,
  searchProperties,
  updateRoomInventory,
} from "@/lib/mock/hotel-db";
import { getHotelRooms, mockDb, mockFetch } from "@/lib/mock/db";
import type { HotelRoom, HotelSearchQuery } from "@/lib/types";
import { useCurrentUser } from "@/lib/stores/auth";

export const hotelQueryKeys = {
  search: (q: HotelSearchQuery) => ["hotels", "search", q] as const,
  property: (id: string) => ["hotels", "property", id] as const,
  included: (tourId: string) => ["hotels", "included", tourId] as const,
  myBookings: (userId?: string) => ["hotels", "bookings", userId] as const,
  booking: (ref: string) => ["hotels", "booking", ref] as const,
  pending: ["hotels", "pending"] as const,
  inventory: (hotelId: string) => ["hotels", "inventory", hotelId] as const,
};

export function useHotelSearch(query: HotelSearchQuery, enabled = true) {
  return useQuery({
    queryKey: hotelQueryKeys.search(query),
    queryFn: () => mockHotelFetch(searchProperties(query)),
    enabled: enabled && Boolean(query.checkIn && query.checkOut),
  });
}

export function useHotelProperty(id: string) {
  return useQuery({
    queryKey: hotelQueryKeys.property(id),
    queryFn: async () => {
      const hotel = getHotelById(id);
      if (!hotel) throw new Error("Not found");
      return mockHotelFetch({
        hotel,
        rooms: getHotelRooms(id),
      });
    },
    enabled: Boolean(id),
  });
}

export function useTourIncludedStays(tourId: string) {
  return useQuery({
    queryKey: hotelQueryKeys.included(tourId),
    queryFn: () => mockHotelFetch(getTourIncludedStays(tourId)),
    enabled: Boolean(tourId),
  });
}

export function useMyHotelBookings() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: hotelQueryKeys.myBookings(user?.id),
    queryFn: () => mockHotelFetch(getHotelBookingsForUser(user!.id)),
    enabled: Boolean(user),
  });
}

export function useHotelBooking(reference: string) {
  return useQuery({
    queryKey: hotelQueryKeys.booking(reference),
    queryFn: async () => {
      const b = getHotelBookingByRef(reference);
      if (!b) throw new Error("Not found");
      return mockHotelFetch(b);
    },
    enabled: Boolean(reference),
  });
}

export function usePendingHotelBookings() {
  return useQuery({
    queryKey: hotelQueryKeys.pending,
    queryFn: () => mockHotelFetch(getPendingHotelBookings()),
  });
}

export function usePropertyInventory(hotelId: string) {
  return useQuery({
    queryKey: hotelQueryKeys.inventory(hotelId),
    queryFn: () => mockHotelFetch(getInventoryForProperty(hotelId)),
    enabled: Boolean(hotelId),
  });
}

export function useCreateHotelBooking() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Omit<CreateHotelBookingInput, "userId" | "customerName">,
    ) => {
      if (!user) throw new Error("Sign in required");
      return mockHotelFetch(
        createHotelBooking({
          ...input,
          userId: user.id,
          customerName: user.fullName,
        }),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: hotelQueryKeys.myBookings(user?.id) });
      qc.invalidateQueries({ queryKey: hotelQueryKeys.pending });
      qc.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}

export function useConfirmHotelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const updated = confirmHotelBooking(id);
      if (!updated) throw new Error("Cannot confirm");
      return mockHotelFetch(updated);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: hotelQueryKeys.pending });
      qc.invalidateQueries({ queryKey: ["hotels", "bookings"] });
    },
  });
}

export function useDeclineHotelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const updated = declineHotelBooking(id, reason);
      if (!updated) throw new Error("Cannot decline");
      return mockHotelFetch(updated);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: hotelQueryKeys.pending });
      qc.invalidateQueries({ queryKey: ["hotels", "bookings"] });
    },
  });
}

export function usePartnerRooms(partnerId?: string) {
  return useQuery({
    queryKey: hotelQueryKeys.inventory(partnerId ?? "partner"),
    queryFn: async () => {
      const hotel = mockDb.hotels.find((h) => h.partnerId === partnerId);
      if (!hotel) return mockHotelFetch([] as HotelRoom[]);
      return mockHotelFetch(getHotelRooms(hotel.id));
    },
    enabled: Boolean(partnerId),
  });
}

export function useUpdateRoomInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      hotelId,
      patch,
    }: {
      roomId: string;
      hotelId: string;
      patch: { available?: number; total?: number; rateUsd?: number };
    }) => mockFetch(updateRoomInventory(roomId, patch)!),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: hotelQueryKeys.property(vars.hotelId) });
      qc.invalidateQueries({ queryKey: hotelQueryKeys.inventory(vars.hotelId) });
      qc.invalidateQueries({ queryKey: ["hotelRooms"] });
    },
  });
}

export { mockDb as hotelMockDb };
