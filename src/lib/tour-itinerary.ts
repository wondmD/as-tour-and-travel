import { ethiopiaImages } from "@/lib/images";
import type { TourItineraryStop } from "@/lib/types";

/** Cover images for catalog destinations used in the route designer. */
export const DESTINATION_COVER: Record<string, string> = {
  lalibela: ethiopiaImages.lalibela,
  gondar: ethiopiaImages.entoto.hero,
  "bahir-dar": ethiopiaImages.blueNile,
  danakil: ethiopiaImages.danakil,
  simien: ethiopiaImages.simien,
};

const DEFAULT_COVER = ethiopiaImages.tourCover;

export function destinationCoverImage(destinationId: string): string {
  return DESTINATION_COVER[destinationId] ?? DEFAULT_COVER;
}

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

export function daysBetween(startIso: string, endIso: string): number {
  const start = parseDate(startIso);
  const end = parseDate(endIso);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function departureDate(arrivalDate: string, nights: number): string {
  return addDays(arrivalDate, Math.max(nights, 0));
}

export function computeDayNumber(tourStartDate: string, arrivalDate: string): number {
  return daysBetween(tourStartDate, arrivalDate) + 1;
}

export function formatDisplayDate(iso: string): string {
  return parseDate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return parseDate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Sort stops by arrival date and recompute day numbers. */
export function normalizeItineraryStops(
  stops: TourItineraryStop[],
  tourStartDate: string,
): TourItineraryStop[] {
  return [...stops]
    .sort(
      (a, b) =>
        parseDate(a.arrivalDate).getTime() - parseDate(b.arrivalDate).getTime(),
    )
    .map((stop) => ({
      ...stop,
      dayNumber: computeDayNumber(tourStartDate, stop.arrivalDate),
    }));
}

export function suggestNextArrivalDate(
  stops: TourItineraryStop[],
  tourStartDate: string,
): string {
  if (stops.length === 0) return tourStartDate;
  const sorted = normalizeItineraryStops(stops, tourStartDate);
  const last = sorted[sorted.length - 1]!;
  return departureDate(last.arrivalDate, last.nights);
}

export function computeTourDurationDays(
  stops: TourItineraryStop[],
  tourStartDate: string,
): number {
  if (stops.length === 0) return 0;
  const sorted = normalizeItineraryStops(stops, tourStartDate);
  const last = sorted[sorted.length - 1]!;
  const lastDeparture = departureDate(last.arrivalDate, last.nights);
  return computeDayNumber(tourStartDate, lastDeparture);
}

export function destinationSummaryFromStops(stops: TourItineraryStop[]): string {
  if (stops.length === 0) return "Ethiopia";
  const names = normalizeItineraryStops(stops, stops[0]?.arrivalDate ?? "")
    .map((s) => s.destinationName);
  if (names.length <= 2) return names.join(" & ");
  return `${names[0]} → ${names[names.length - 1]}`;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function builderCompletionPercent(input: {
  title: string;
  slug: string;
  basePriceUsd: number;
  stops: TourItineraryStop[];
}): number {
  let score = 0;
  if (input.title.trim().length >= 3) score += 25;
  if (input.slug.trim().length >= 3) score += 15;
  if (input.basePriceUsd > 0) score += 20;
  if (input.stops.length >= 1) score += 25;
  if (input.stops.length >= 2) score += 15;
  return Math.min(score, 100);
}
