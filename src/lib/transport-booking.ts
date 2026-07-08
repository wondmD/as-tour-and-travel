import type { TransportRoute, TransportSearchQuery } from "@/lib/types";

export function transportTypeLabel(type: TransportRoute["type"]): string {
  const labels: Record<TransportRoute["type"], string> = {
    flight: "Flight",
    bus: "Coach / bus",
    private_car: "Private transfer",
  };
  return labels[type];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function nextTransportReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `TRN-${n}`;
}

/** Per-passenger pricing for flights/buses; private car scales with party size. */
export function computeTransportTotal(
  route: TransportRoute,
  passengers: number,
): number {
  const p = Math.max(1, passengers);
  if (route.type === "private_car") {
    const base = route.priceFromUsd;
    return p <= 4 ? base : base + (p - 4) * Math.round(base * 0.15);
  }
  return route.priceFromUsd * p;
}

function matchesLocation(
  routeValue: string,
  query?: string,
  destinationId?: string,
  routeDestinationId?: string,
): boolean {
  if (destinationId && routeDestinationId) {
    return routeDestinationId === destinationId;
  }
  if (!query) return true;
  const q = query.toLowerCase();
  return routeValue.toLowerCase().includes(q) || q.includes(routeValue.toLowerCase().split(" ")[0] ?? "");
}

export function searchTransportRoutes(
  routes: TransportRoute[],
  query: TransportSearchQuery,
): TransportRoute[] {
  return routes.filter((r) => {
    if (r.status === "inactive") return false;
    if (query.type && r.type !== query.type) return false;
    if (
      !matchesLocation(
        r.origin,
        query.origin,
        query.originDestinationId,
        r.originDestinationId,
      )
    ) {
      return false;
    }
    if (
      !matchesLocation(
        r.destination,
        query.destination,
        query.destinationDestinationId,
        r.destinationDestinationId,
      )
    ) {
      return false;
    }
    return true;
  });
}

export function fulfillmentLabel(type: "instant" | "on_request"): string {
  return type === "instant" ? "Instant confirmation" : "Coordinated by AS Tour";
}
