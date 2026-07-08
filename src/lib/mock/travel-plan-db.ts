import type { TravelPlan, TravelPlanStop, TravelPlanStatus } from "@/lib/types";
import {
  computeTravelEndDate,
  inferTravelKind,
  nextTravelReference,
  normalizeTravelStops,
} from "@/lib/travel-plan";
import { mockDb, mockFetch, nextId } from "./db";

export function getTravelHubs() {
  return mockDb.travelHubs.filter((h) => h.status === "active");
}

export function getTravelPlans(userId?: string) {
  const list = [...mockDb.travelPlans].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  if (userId) return list.filter((p) => p.userId === userId);
  return list;
}

export function getTravelPlan(id: string) {
  return mockDb.travelPlans.find((p) => p.id === id);
}

export function getTravelPlanByRef(reference: string) {
  return mockDb.travelPlans.find((p) => p.reference === reference);
}

export interface SaveTravelPlanInput {
  id?: string;
  userId: string;
  customerName: string;
  name: string;
  kind: TravelPlan["kind"];
  travelerCount: number;
  stops: TravelPlanStop[];
  notes?: string;
  assistanceRequested: boolean;
  submit?: boolean;
}

export function saveTravelPlan(input: SaveTravelPlanInput): TravelPlan {
  const stops = normalizeTravelStops(input.stops);
  const startDate = stops[0]?.arrivalDate ?? new Date().toISOString().slice(0, 10);
  const endDate = computeTravelEndDate(stops);
  const kind = inferTravelKind(stops, input.kind);
  const now = new Date().toISOString();

  if (input.id) {
    const idx = mockDb.travelPlans.findIndex((p) => p.id === input.id);
    if (idx < 0) throw new Error("Plan not found");
    const existing = mockDb.travelPlans[idx]!;
    const updated: TravelPlan = {
      ...existing,
      name: input.name.trim(),
      kind,
      travelerCount: input.travelerCount,
      stops,
      startDate,
      endDate,
      notes: input.notes,
      assistanceRequested: input.assistanceRequested,
      status: input.submit
        ? existing.status === "draft"
          ? "submitted"
          : existing.status
        : existing.status === "submitted"
          ? existing.status
          : "draft",
      updatedAt: now,
    };
    mockDb.travelPlans[idx] = updated;
    return updated;
  }

  const plan: TravelPlan = {
    id: nextId("tpl"),
    reference: nextTravelReference(),
    userId: input.userId,
    customerName: input.customerName,
    name: input.name.trim(),
    kind,
    travelerCount: input.travelerCount,
    stops,
    startDate,
    endDate,
    notes: input.notes,
    assistanceRequested: input.assistanceRequested,
    status: input.submit ? "submitted" : "draft",
    createdAt: now,
    updatedAt: now,
  };
  mockDb.travelPlans.push(plan);
  return plan;
}

export function updateTravelPlanStatus(
  id: string,
  status: TravelPlanStatus,
  patch?: { quotedUsd?: number; staffNotes?: string },
) {
  const idx = mockDb.travelPlans.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  mockDb.travelPlans[idx] = {
    ...mockDb.travelPlans[idx]!,
    status,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return mockDb.travelPlans[idx]!;
}

export { mockFetch };
