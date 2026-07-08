import type {
  TransportBooking,
  TransportRoute,
  TransportSearchQuery,
  TourIncludedTransfer,
} from "@/lib/types";
import {
  computeTransportTotal,
  nextTransportReference,
  searchTransportRoutes,
} from "@/lib/transport-booking";
import {
  attachRoutesToLegs,
  buildLegsFromItinerary,
} from "@/lib/tour-transport";
import { mockDb, mockFetch, nextId } from "./db";
import { getTourItinerary } from "./tour-itinerary-db";

export { searchTransportRoutes, computeTransportTotal, formatDuration, transportTypeLabel, fulfillmentLabel } from "@/lib/transport-booking";

export async function mockTransportFetch<T>(data: T, ms?: number) {
  return mockFetch(data, ms);
}

export function getTransportRoute(id: string): TransportRoute | undefined {
  return mockDb.transportRoutes.find((r) => r.id === id);
}

export function searchTransport(query: TransportSearchQuery) {
  const routes = searchTransportRoutes(mockDb.transportRoutes, query);
  return routes.map((route) => ({
    route,
    totalUsd: computeTransportTotal(route, query.passengers),
    fulfillmentType: route.fulfillmentType ?? "instant",
    assistanceIncluded: route.assistanceIncluded ?? false,
  }));
}

export function getTourIncludedTransfers(tourId: string): TourIncludedTransfer[] {
  return mockDb.tourIncludedTransfers.filter((t) => t.tourId === tourId);
}

export function getTourTravelLegs(tourId: string) {
  const itinerary = getTourItinerary(tourId);
  if (!itinerary || itinerary.stops.length === 0) {
    return { itinerary, legs: [], included: getTourIncludedTransfers(tourId) };
  }

  let legs = buildLegsFromItinerary(itinerary, tourId);
  legs = attachRoutesToLegs(
    legs,
    mockDb.transportRoutes,
    itinerary.stops.map((s) => ({ id: s.id, destinationId: s.destinationId })),
  );

  return {
    itinerary,
    legs,
    included: getTourIncludedTransfers(tourId),
  };
}

export function getTransportBookingsForUser(userId: string) {
  return mockDb.transportBookings
    .filter((b) => b.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getTransportBookingByRef(reference: string) {
  return mockDb.transportBookings.find((b) => b.reference === reference);
}

export function getPendingTransportBookings() {
  return mockDb.transportBookings.filter(
    (b) => b.status === "pending_confirmation",
  );
}

export interface CreateTransportBookingInput {
  userId: string;
  customerName: string;
  routeId: string;
  travelDate: string;
  passengers: number;
  source?: TransportBooking["source"];
  linkedTourBookingRef?: string;
  linkedTourId?: string;
  pickupLocation?: string;
  pickupTime?: string;
  assistanceNotes?: string;
}

export function createTransportBooking(
  input: CreateTransportBookingInput,
): TransportBooking {
  const route = getTransportRoute(input.routeId);
  if (!route || route.status === "inactive") {
    throw new Error("Route not available");
  }

  const fulfillmentType = route.fulfillmentType ?? "instant";
  const instant = fulfillmentType === "instant";
  const now = new Date().toISOString();

  const booking: TransportBooking = {
    id: nextId("tb"),
    reference: nextTransportReference(),
    userId: input.userId,
    customerName: input.customerName,
    routeId: route.id,
    routeType: route.type,
    origin: route.origin,
    destination: route.destination,
    operator: route.operator,
    travelDate: input.travelDate,
    passengers: input.passengers,
    amountUsd: computeTransportTotal(route, input.passengers),
    status: instant ? "confirmed" : "pending_confirmation",
    fulfillmentType,
    source: input.source ?? "standalone",
    linkedTourBookingRef: input.linkedTourBookingRef,
    linkedTourId: input.linkedTourId,
    coordinatedByCompany: route.assistanceIncluded ?? true,
    pickupLocation: input.pickupLocation,
    pickupTime: input.pickupTime,
    assistanceNotes: input.assistanceNotes,
    meetingPoint: instant
      ? `${route.origin} — AS Tour coordinator on site`
      : undefined,
    createdAt: now,
    confirmedAt: instant ? now : undefined,
    paymentStatus: instant ? "successful" : "pending",
  };

  if (instant && route.type === "private_car") {
    booking.driverName = "Assigned on confirmation";
    booking.driverPhone = "+251 11 000 0000";
  }

  mockDb.transportBookings.push(booking);
  return booking;
}

export function confirmTransportBooking(id: string, staffName: string) {
  const booking = mockDb.transportBookings.find((b) => b.id === id);
  if (!booking) return null;
  booking.status = "confirmed";
  booking.confirmedAt = new Date().toISOString();
  booking.paymentStatus = "successful";
  booking.meetingPoint =
    booking.meetingPoint ?? `${booking.origin} — look for AS Tour sign`;
  booking.driverName = booking.driverName ?? "AS Tour driver";
  booking.driverPhone = booking.driverPhone ?? "+251 91 000 0000";
  booking.assistanceNotes = booking.assistanceNotes
    ? `${booking.assistanceNotes} (Confirmed by ${staffName})`
    : `Confirmed by ${staffName}`;
  return booking;
}

export function declineTransportBooking(id: string, reason: string) {
  const booking = mockDb.transportBookings.find((b) => b.id === id);
  if (!booking) return null;
  booking.status = "declined";
  booking.declinedReason = reason;
  booking.paymentStatus = "refunded";
  return booking;
}

export function getSuggestedRoutesForTour(tourId: string, passengers = 2) {
  const { legs } = getTourTravelLegs(tourId);
  return legs
    .filter((leg) => leg.defaultRouteId)
    .map((leg) => {
      const route = getTransportRoute(leg.defaultRouteId!)!;
      return {
        leg,
        route,
        totalUsd: computeTransportTotal(route, passengers),
      };
    });
}
