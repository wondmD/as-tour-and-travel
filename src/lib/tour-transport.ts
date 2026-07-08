import type { TourItinerary, TourItineraryLeg, TransportRoute } from "@/lib/types";
import { departureDate } from "@/lib/tour-itinerary";
import { normalizeItineraryStops } from "@/lib/tour-itinerary";
import { nextId } from "@/lib/mock/db";

export function buildLegsFromItinerary(
  itinerary: TourItinerary,
  tourId: string,
): TourItineraryLeg[] {
  const stops = normalizeItineraryStops(
    itinerary.stops,
    itinerary.tourStartDate,
  );
  const legs: TourItineraryLeg[] = [];

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i]!;
    const to = stops[i + 1]!;
    legs.push({
      id: `leg-${from.id}-${to.id}`,
      tourId,
      fromStopId: from.id,
      toStopId: to.id,
      fromName: from.destinationName,
      toName: to.destinationName,
      travelDate: departureDate(from.arrivalDate, from.nights),
      includedInPackage: true,
      notes: `Travel day from ${from.destinationName} to ${to.destinationName}`,
    });
  }

  return legs;
}

export function matchRouteForLeg(
  leg: TourItineraryLeg,
  routes: TransportRoute[],
  fromDestinationId?: string,
  toDestinationId?: string,
): TransportRoute | undefined {
  const active = routes.filter((r) => r.status !== "inactive");

  if (fromDestinationId && toDestinationId) {
    const exact = active.find(
      (r) =>
        r.originDestinationId === fromDestinationId &&
        r.destinationDestinationId === toDestinationId,
    );
    if (exact) return exact;
  }

  const fromLower = leg.fromName.toLowerCase();
  const toLower = leg.toName.toLowerCase();
  return active.find(
    (r) =>
      r.origin.toLowerCase().includes(fromLower.split(" ")[0] ?? fromLower) &&
      r.destination.toLowerCase().includes(toLower.split(" ")[0] ?? toLower),
  );
}

export function attachRoutesToLegs(
  legs: TourItineraryLeg[],
  routes: TransportRoute[],
  stops: { id: string; destinationId: string }[],
): TourItineraryLeg[] {
  return legs.map((leg) => {
    const fromStop = stops.find((s) => s.id === leg.fromStopId);
    const toStop = stops.find((s) => s.id === leg.toStopId);
    const route = matchRouteForLeg(
      leg,
      routes,
      fromStop?.destinationId,
      toStop?.destinationId,
    );
    return route ? { ...leg, defaultRouteId: route.id } : leg;
  });
}

export function createAirportArrivalLeg(
  tourId: string,
  firstStopName: string,
  firstStopId: string,
  travelDate: string,
): TourItineraryLeg {
  return {
    id: nextId("leg"),
    tourId,
    fromStopId: "airport-add",
    toStopId: firstStopId,
    fromName: "Addis Ababa (ADD)",
    toName: firstStopName,
    travelDate,
    includedInPackage: true,
    notes: "Airport meet & greet and transfer to first destination",
  };
}
