import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrCreateTourItinerary,
  getTourItinerary,
  saveTourDesign,
  type SaveTourDesignInput,
} from "@/lib/mock/tour-itinerary-db";
import { mockFetch } from "@/lib/mock/db";

export const tourBuilderKeys = {
  itinerary: (tourId: string) => ["tourItinerary", tourId] as const,
};

export function useTourItinerary(tourId: string | undefined) {
  return useQuery({
    queryKey: tourBuilderKeys.itinerary(tourId ?? ""),
    queryFn: async () => {
      const itinerary = tourId
        ? getTourItinerary(tourId) ?? getOrCreateTourItinerary(tourId)
        : null;
      return mockFetch(itinerary);
    },
    enabled: Boolean(tourId),
  });
}

export function useSaveTourDesign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SaveTourDesignInput) =>
      mockFetch(saveTourDesign(input)),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["tours"] });
      qc.invalidateQueries({ queryKey: ["tours", result.tour.id] });
      qc.invalidateQueries({
        queryKey: tourBuilderKeys.itinerary(result.tour.id),
      });
    },
  });
}
