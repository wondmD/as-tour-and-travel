import type { TourType } from "@/lib/types";

export const TOUR_TYPE_LABELS: Record<TourType, string> = {
  group_departure: "Group departure",
  semi_private: "Small group",
  private: "Private tour",
  custom: "Custom itinerary",
};

export const TOUR_TYPE_DESCRIPTIONS: Record<TourType, string> = {
  group_departure: "Fixed departures with shared group experience and departure memories.",
  semi_private: "Limited seats, intimate group, shared departure gallery.",
  private: "Exclusive to your party — no shared memory gallery.",
  custom: "Built around your destinations and dates.",
};
