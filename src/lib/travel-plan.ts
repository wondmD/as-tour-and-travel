import type { TravelHub, TravelPlanKind, TravelPlanStop } from "@/lib/types";

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d);
}

function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  return formatDateLocal(d);
}

export function formatShortDate(iso: string): string {
  return parseDate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const TRAVEL_KIND_LABELS: Record<TravelPlanKind, string> = {
  inbound_international: "Travel to Ethiopia",
  outbound_international: "Leave Ethiopia",
  round_trip_international: "Round trip (international)",
  domestic: "Within one country",
  multi_country: "Multi-country journey",
};

export const TRAVEL_KIND_DESCRIPTIONS: Record<TravelPlanKind, string> = {
  inbound_international:
    "From your home country to Ethiopia — we handle entry, connections, and ground legs.",
  outbound_international:
    "Departing Ethiopia to another country — flights and airport assistance included.",
  round_trip_international:
    "Return journey abroad ↔ Ethiopia with coordinated legs both ways.",
  domestic:
    "Move between cities inside Ethiopia (or another single country) without crossing borders.",
  multi_country:
    "Complex route across several countries — our team designs connections for you.",
};

export function normalizeTravelStops(stops: TravelPlanStop[]): TravelPlanStop[] {
  return [...stops]
    .sort(
      (a, b) =>
        parseDate(a.arrivalDate).getTime() - parseDate(b.arrivalDate).getTime(),
    )
    .map((s, i) => ({ ...s, sortOrder: i + 1 }));
}

export function computeTravelEndDate(stops: TravelPlanStop[]): string | undefined {
  const sorted = normalizeTravelStops(stops);
  const last = sorted[sorted.length - 1];
  if (!last) return undefined;
  return addDays(last.arrivalDate, Math.max(last.nights, 0));
}

export function suggestNextArrivalDate(stops: TravelPlanStop[]): string {
  const today = new Date().toISOString().slice(0, 10);
  if (stops.length === 0) return today;
  const sorted = normalizeTravelStops(stops);
  const last = sorted[sorted.length - 1]!;
  return addDays(last.arrivalDate, Math.max(last.nights, 1));
}

export function inferTravelKind(
  stops: TravelPlanStop[],
  explicit?: TravelPlanKind,
): TravelPlanKind {
  if (explicit) return explicit;
  if (stops.length === 0) return "inbound_international";

  const codes = stops.map((s) => s.countryCode);
  const hasEthiopia = codes.includes("ET");
  const foreign = codes.filter((c) => c !== "ET");
  const uniqueForeign = new Set(foreign);

  if (!hasEthiopia && foreign.length > 0) return "multi_country";
  if (hasEthiopia && foreign.length === 0) return "domestic";
  if (hasEthiopia && foreign.length >= 1) {
    const first = codes[0];
    const last = codes[codes.length - 1];
    if (first !== "ET" && last !== "ET") return "round_trip_international";
    if (first !== "ET") return "inbound_international";
    if (last !== "ET") return "outbound_international";
    return "multi_country";
  }
  return "inbound_international";
}

export function filterHubsForKind(
  hubs: TravelHub[],
  kind: TravelPlanKind,
): TravelHub[] {
  const active = hubs.filter((h) => h.status === "active");
  switch (kind) {
    case "domestic":
      return active.filter((h) => h.isEthiopia);
    case "inbound_international":
    case "outbound_international":
    case "round_trip_international":
      return active;
    case "multi_country":
      return active;
    default:
      return active;
  }
}

export function hubLabel(hub: TravelHub): string {
  return `${hub.city}, ${hub.countryName}`;
}

export function routeSummary(stops: TravelPlanStop[]): string {
  const sorted = normalizeTravelStops(stops);
  if (sorted.length === 0) return "No stops yet";
  if (sorted.length === 1) return `${sorted[0]!.city}, ${sorted[0]!.countryName}`;
  return `${sorted[0]!.city} → … → ${sorted[sorted.length - 1]!.city}`;
}

export function nextTravelReference(): string {
  return `TRV-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function travelPlanCompletion(input: {
  name: string;
  stops: TravelPlanStop[];
  travelerCount: number;
}): number {
  let score = 0;
  if (input.name.trim().length >= 2) score += 20;
  if (input.travelerCount >= 1) score += 20;
  if (input.stops.length >= 1) score += 25;
  if (input.stops.length >= 2) score += 20;
  if (input.stops.every((s) => s.arrivalDate && s.nights >= 0)) score += 15;
  return Math.min(score, 100);
}
