import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTransportBookingInput } from "@/lib/mock/transport-db";
import {
  confirmTransportBooking,
  createTransportBooking,
  declineTransportBooking,
  getPendingTransportBookings,
  getSuggestedRoutesForTour,
  getTourIncludedTransfers,
  getTourTravelLegs,
  getTransportBookingByRef,
  getTransportBookingsForUser,
  getTransportRoute,
  mockTransportFetch,
  searchTransport,
} from "@/lib/mock/transport-db";
import type { TransportSearchQuery } from "@/lib/types";
import { useCurrentUser } from "@/lib/stores/auth";

export const transportQueryKeys = {
  search: (q: TransportSearchQuery) => ["transport", "search", q] as const,
  route: (id: string) => ["transport", "route", id] as const,
  included: (tourId: string) => ["transport", "included", tourId] as const,
  travelPlan: (tourId: string) => ["transport", "travelPlan", tourId] as const,
  suggested: (tourId: string, passengers: number) =>
    ["transport", "suggested", tourId, passengers] as const,
  myBookings: (userId?: string) => ["transport", "bookings", userId] as const,
  booking: (ref: string) => ["transport", "booking", ref] as const,
  pending: ["transport", "pending"] as const,
};

export function useTransportSearch(query: TransportSearchQuery, enabled = true) {
  return useQuery({
    queryKey: transportQueryKeys.search(query),
    queryFn: () => mockTransportFetch(searchTransport(query)),
    enabled: enabled && Boolean(query.travelDate),
  });
}

export function useTransportRoute(id: string) {
  return useQuery({
    queryKey: transportQueryKeys.route(id),
    queryFn: async () => {
      const route = getTransportRoute(id);
      if (!route) throw new Error("Not found");
      return mockTransportFetch(route);
    },
    enabled: Boolean(id),
  });
}

export function useTourIncludedTransfers(tourId: string) {
  return useQuery({
    queryKey: transportQueryKeys.included(tourId),
    queryFn: () => mockTransportFetch(getTourIncludedTransfers(tourId)),
    enabled: Boolean(tourId),
  });
}

export function useTourTravelPlan(tourId: string) {
  return useQuery({
    queryKey: transportQueryKeys.travelPlan(tourId),
    queryFn: () => mockTransportFetch(getTourTravelLegs(tourId)),
    enabled: Boolean(tourId),
  });
}

export function useSuggestedTourRoutes(tourId: string, passengers = 2) {
  return useQuery({
    queryKey: transportQueryKeys.suggested(tourId, passengers),
    queryFn: () => mockTransportFetch(getSuggestedRoutesForTour(tourId, passengers)),
    enabled: Boolean(tourId),
  });
}

export function useMyTransportBookings() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: transportQueryKeys.myBookings(user?.id),
    queryFn: () => mockTransportFetch(getTransportBookingsForUser(user!.id)),
    enabled: Boolean(user),
  });
}

export function useTransportBooking(reference: string) {
  return useQuery({
    queryKey: transportQueryKeys.booking(reference),
    queryFn: async () => {
      const b = getTransportBookingByRef(reference);
      if (!b) throw new Error("Not found");
      return mockTransportFetch(b);
    },
    enabled: Boolean(reference),
  });
}

export function usePendingTransportBookings() {
  return useQuery({
    queryKey: transportQueryKeys.pending,
    queryFn: () => mockTransportFetch(getPendingTransportBookings()),
  });
}

export function useCreateTransportBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTransportBookingInput) =>
      mockTransportFetch(createTransportBooking(input)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transport", "bookings"] });
      qc.invalidateQueries({ queryKey: transportQueryKeys.pending });
    },
  });
}

export function useConfirmTransportBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, staffName }: { id: string; staffName: string }) =>
      mockTransportFetch(confirmTransportBooking(id, staffName)!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transport"] });
    },
  });
}

export function useDeclineTransportBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) =>
      mockTransportFetch(declineTransportBooking(id, reason)!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transport"] });
    },
  });
}
