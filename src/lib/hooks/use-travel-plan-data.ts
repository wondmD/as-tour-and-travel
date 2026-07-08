import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTravelHubs,
  getTravelPlan,
  getTravelPlanByRef,
  getTravelPlans,
  saveTravelPlan,
  type SaveTravelPlanInput,
  updateTravelPlanStatus,
} from "@/lib/mock/travel-plan-db";
import { mockFetch } from "@/lib/mock/db";
import { useCurrentUser } from "@/lib/stores/auth";
import type { TravelPlanStatus } from "@/lib/types";

export const travelPlanKeys = {
  hubs: ["travelHubs"] as const,
  plans: (userId?: string) => ["travelPlans", userId] as const,
  allPlans: ["travelPlans", "all"] as const,
  plan: (id: string) => ["travelPlan", id] as const,
  planRef: (ref: string) => ["travelPlan", "ref", ref] as const,
};

export function useTravelHubs() {
  return useQuery({
    queryKey: travelPlanKeys.hubs,
    queryFn: () => mockFetch(getTravelHubs()),
  });
}

export function useMyTravelPlans() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: travelPlanKeys.plans(user?.id),
    queryFn: () => mockFetch(getTravelPlans(user!.id)),
    enabled: Boolean(user),
  });
}

export function useAllTravelPlans() {
  return useQuery({
    queryKey: travelPlanKeys.allPlans,
    queryFn: () => mockFetch(getTravelPlans()),
  });
}

export function useTravelPlanByRef(reference: string) {
  return useQuery({
    queryKey: travelPlanKeys.planRef(reference),
    queryFn: async () => {
      const p = getTravelPlanByRef(reference);
      if (!p) throw new Error("Not found");
      return mockFetch(p);
    },
    enabled: Boolean(reference),
  });
}

export function useTravelPlan(id: string) {
  return useQuery({
    queryKey: travelPlanKeys.plan(id),
    queryFn: async () => {
      const p = getTravelPlan(id);
      if (!p) throw new Error("Not found");
      return mockFetch(p);
    },
    enabled: Boolean(id),
  });
}

export function useSaveTravelPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SaveTravelPlanInput) =>
      mockFetch(saveTravelPlan(input)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travelPlans"] });
    },
  });
}

export function useUpdateTravelPlanStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      quotedUsd,
      staffNotes,
    }: {
      id: string;
      status: TravelPlanStatus;
      quotedUsd?: number;
      staffNotes?: string;
    }) => mockFetch(updateTravelPlanStatus(id, status, { quotedUsd, staffNotes })!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["travelPlans"] }),
  });
}
