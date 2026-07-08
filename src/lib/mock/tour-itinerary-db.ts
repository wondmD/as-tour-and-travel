import type {
  CreateTourInput,
  TourItinerary,
  TourItineraryStop,
  TourProduct,
} from "@/lib/types";
import {
  computeTourDurationDays,
  destinationSummaryFromStops,
  normalizeItineraryStops,
} from "@/lib/tour-itinerary";
import { mockDb, nextId } from "./db";

export function getTourItinerary(tourId: string): TourItinerary | undefined {
  return mockDb.tourItineraries.find((i) => i.tourId === tourId);
}

export function getOrCreateTourItinerary(tourId: string): TourItinerary {
  const existing = getTourItinerary(tourId);
  if (existing) return existing;
  const created: TourItinerary = {
    tourId,
    tourStartDate: new Date().toISOString().slice(0, 10),
    stops: [],
    updatedAt: new Date().toISOString(),
  };
  mockDb.tourItineraries.push(created);
  return created;
}

export function saveTourItinerary(
  tourId: string,
  input: Pick<TourItinerary, "tourStartDate" | "stops">,
): TourItinerary {
  const stops = normalizeItineraryStops(input.stops, input.tourStartDate);
  const updated: TourItinerary = {
    tourId,
    tourStartDate: input.tourStartDate,
    stops,
    updatedAt: new Date().toISOString(),
  };
  const idx = mockDb.tourItineraries.findIndex((i) => i.tourId === tourId);
  if (idx >= 0) mockDb.tourItineraries[idx] = updated;
  else mockDb.tourItineraries.push(updated);

  const tour = mockDb.tours.find((t) => t.id === tourId);
  if (tour) {
    tour.durationDays = computeTourDurationDays(stops, input.tourStartDate);
    tour.destination = destinationSummaryFromStops(stops);
    if (stops[0]?.coverImage && tour.coverImage.includes("stock")) {
      tour.coverImage = stops[0].coverImage;
    }
  }

  return updated;
}

export function createTour(
  input: CreateTourInput,
  itinerary?: Pick<TourItinerary, "tourStartDate" | "stops">,
): TourProduct {
  const id = nextId("tour");
  const tour: TourProduct = {
    id,
    slug: input.slug,
    title: input.title,
    destination: input.destination,
    durationDays: input.durationDays,
    basePriceUsd: input.basePriceUsd,
    coverImage: input.coverImage,
    status: input.status ?? "draft",
    rating: 0,
    reviewCount: 0,
    category: input.category,
    tourType: input.tourType,
  };
  mockDb.tours.push(tour);

  if (itinerary) {
    saveTourItinerary(id, itinerary);
  } else {
    mockDb.tourItineraries.push({
      tourId: id,
      tourStartDate: new Date().toISOString().slice(0, 10),
      stops: [],
      updatedAt: new Date().toISOString(),
    });
  }

  return tour;
}

export interface SaveTourDesignInput {
  tourId?: string;
  tour: CreateTourInput;
  tourStartDate: string;
  stops: TourItineraryStop[];
  publish?: boolean;
}

export function saveTourDesign(input: SaveTourDesignInput): {
  tour: TourProduct;
  itinerary: TourItinerary;
} {
  const status = input.publish ? "published" : (input.tour.status ?? "draft");
  let tour: TourProduct;

  if (input.tourId) {
    const idx = mockDb.tours.findIndex((t) => t.id === input.tourId);
    if (idx < 0) throw new Error("Tour not found");
    tour = {
      ...mockDb.tours[idx]!,
      ...input.tour,
      status,
      durationDays: computeTourDurationDays(input.stops, input.tourStartDate),
      destination: destinationSummaryFromStops(input.stops),
    };
    mockDb.tours[idx] = tour;
  } else {
    tour = createTour({ ...input.tour, status }, {
      tourStartDate: input.tourStartDate,
      stops: input.stops,
    });
    return { tour, itinerary: getTourItinerary(tour.id)! };
  }

  const itinerary = saveTourItinerary(tour.id, {
    tourStartDate: input.tourStartDate,
    stops: input.stops,
  });

  return { tour, itinerary };
}
