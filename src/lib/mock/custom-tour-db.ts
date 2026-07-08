import type {
  CustomTourProposal,
  CustomTourRequest,
  CustomTourRequestStatus,
  TourMemory,
} from "@/lib/types";
import { mockDb, mockFetch, nextId } from "@/lib/mock/db";
import { DESTINATIONS } from "@/lib/mock/seed";

export function getTourMemories(tourId?: string): TourMemory[] {
  const list = mockDb.tourMemories.filter((m) => m.status === "published");
  if (tourId) return list.filter((m) => m.tourId === tourId);
  return list;
}

export function getTourMemory(id: string) {
  return mockDb.tourMemories.find((m) => m.id === id);
}

export function getCustomTourRequests(userId?: string) {
  const list = [...mockDb.customTourRequests].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  if (userId) return list.filter((r) => r.userId === userId);
  return list;
}

export function getCustomTourRequest(id: string) {
  return mockDb.customTourRequests.find((r) => r.id === id);
}

export function getCustomTourRequestByRef(reference: string) {
  return mockDb.customTourRequests.find((r) => r.reference === reference);
}

export function getProposalForRequest(requestId: string) {
  const req = getCustomTourRequest(requestId);
  if (!req?.proposalId) return undefined;
  return mockDb.customTourProposals.find((p) => p.id === req.proposalId);
}

export function getProposal(id: string) {
  return mockDb.customTourProposals.find((p) => p.id === id);
}

function nextCustomRef() {
  const nums = mockDb.customTourRequests
    .map((r) => parseInt(r.reference.replace("CTR-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  return `CTR-${(nums.length ? Math.max(...nums) : 1044) + 1}`;
}

export interface CreateCustomTourRequestInput {
  userId: string;
  customerName: string;
  destinationIds: string[];
  preferredStartDate?: string;
  preferredEndDate?: string;
  durationDays?: number;
  travelerCount: number;
  budgetUsd?: number;
  notes?: string;
  createdByStaff?: boolean;
  assignedStaffName?: string;
}

export function createCustomTourRequest(input: CreateCustomTourRequestInput) {
  const destinationNames = input.destinationIds.map(
    (id) => DESTINATIONS.find((d) => d.id === id)?.name ?? id,
  );
  const now = new Date().toISOString();
  const request: CustomTourRequest = {
    id: nextId("ctr"),
    reference: nextCustomRef(),
    userId: input.userId,
    customerName: input.customerName,
    destinationIds: input.destinationIds,
    destinationNames,
    preferredStartDate: input.preferredStartDate,
    preferredEndDate: input.preferredEndDate,
    durationDays: input.durationDays,
    travelerCount: input.travelerCount,
    budgetUsd: input.budgetUsd,
    notes: input.notes,
    status: input.createdByStaff ? "confirmed" : "submitted",
    createdAt: now,
    updatedAt: now,
    createdByStaff: input.createdByStaff,
    assignedStaffName: input.assignedStaffName,
  };
  mockDb.customTourRequests.unshift(request);

  mockDb.notifications.unshift({
    id: nextId("ntf"),
    userId: input.userId,
    title: input.createdByStaff ? "Custom tour created" : "Custom tour request received",
    body: input.createdByStaff
      ? `${request.reference} — your custom itinerary is ready to review.`
      : `${request.reference} — our team will respond within 2 business days.`,
    read: false,
    createdAt: now,
    category: "booking",
  });

  return request;
}

export function updateCustomTourRequest(
  id: string,
  patch: Partial<CustomTourRequest>,
) {
  const idx = mockDb.customTourRequests.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  mockDb.customTourRequests[idx] = {
    ...mockDb.customTourRequests[idx]!,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return mockDb.customTourRequests[idx]!;
}

export function submitCustomProposal(input: {
  requestId: string;
  title: string;
  itinerarySummary: string;
  durationDays: number;
  priceUsd: number;
  validUntil: string;
  notes?: string;
  createdByName: string;
}) {
  const proposal: CustomTourProposal = {
    id: nextId("prop"),
    requestId: input.requestId,
    title: input.title,
    itinerarySummary: input.itinerarySummary,
    durationDays: input.durationDays,
    priceUsd: input.priceUsd,
    validUntil: input.validUntil,
    notes: input.notes,
    createdByName: input.createdByName,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  mockDb.customTourProposals.push(proposal);
  const req = updateCustomTourRequest(input.requestId, {
    status: "customized",
    proposalId: proposal.id,
  });
  if (req) {
    mockDb.notifications.unshift({
      id: nextId("ntf"),
      userId: req.userId,
      title: "Custom tour proposal ready",
      body: `${req.reference} — review your personalized itinerary and quote.`,
      read: false,
      createdAt: new Date().toISOString(),
      category: "booking",
    });
  }
  return proposal;
}

export function confirmCustomTourRequest(id: string, staffName: string) {
  const req = updateCustomTourRequest(id, {
    status: "confirmed",
    assignedStaffName: staffName,
  });
  if (req) {
    mockDb.notifications.unshift({
      id: nextId("ntf"),
      userId: req.userId,
      title: "Custom tour confirmed",
      body: `${req.reference} is confirmed. You can proceed to booking.`,
      read: false,
      createdAt: new Date().toISOString(),
      category: "booking",
    });
  }
  return req;
}

export function rejectCustomTourRequest(
  id: string,
  reason: string,
  staffName: string,
) {
  const req = updateCustomTourRequest(id, {
    status: "rejected",
    rejectionReason: reason,
    assignedStaffName: staffName,
  });
  if (req) {
    mockDb.notifications.unshift({
      id: nextId("ntf"),
      userId: req.userId,
      title: "Custom tour request update",
      body: `${req.reference} — ${reason}`,
      read: false,
      createdAt: new Date().toISOString(),
      category: "booking",
    });
  }
  return req;
}

export function acceptProposal(proposalId: string) {
  const proposal = mockDb.customTourProposals.find((p) => p.id === proposalId);
  if (!proposal) return null;
  proposal.status = "accepted";
  updateCustomTourRequest(proposal.requestId, { status: "confirmed" });
  return proposal;
}

export { mockFetch };
