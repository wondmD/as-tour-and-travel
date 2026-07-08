import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCustomTourRequestInput } from "@/lib/mock/custom-tour-db";
import {
  acceptProposal,
  confirmCustomTourRequest,
  createCustomTourRequest,
  getCustomTourRequest,
  getCustomTourRequestByRef,
  getCustomTourRequests,
  getProposal,
  getProposalForRequest,
  getTourMemories,
  getTourMemory,
  mockFetch,
  rejectCustomTourRequest,
  submitCustomProposal,
  updateCustomTourRequest,
} from "@/lib/mock/custom-tour-db";
import { useCurrentUser } from "@/lib/stores/auth";

export const customTourKeys = {
  memories: (tourId?: string) => ["tourMemories", tourId] as const,
  memory: (id: string) => ["tourMemory", id] as const,
  requests: (userId?: string) => ["customTourRequests", userId] as const,
  request: (id: string) => ["customTourRequest", id] as const,
  requestRef: (ref: string) => ["customTourRequest", "ref", ref] as const,
  allRequests: ["customTourRequests", "all"] as const,
};

export function useTourMemories(tourId?: string) {
  return useQuery({
    queryKey: customTourKeys.memories(tourId),
    queryFn: () => mockFetch(getTourMemories(tourId)),
  });
}

export function useTourMemory(id: string) {
  return useQuery({
    queryKey: customTourKeys.memory(id),
    queryFn: async () => {
      const m = getTourMemory(id);
      if (!m) throw new Error("Not found");
      return mockFetch(m);
    },
    enabled: Boolean(id),
  });
}

export function useMyCustomTourRequests() {
  const user = useCurrentUser();
  return useQuery({
    queryKey: customTourKeys.requests(user?.id),
    queryFn: () => mockFetch(getCustomTourRequests(user!.id)),
    enabled: Boolean(user),
  });
}

export function useAllCustomTourRequests() {
  return useQuery({
    queryKey: customTourKeys.allRequests,
    queryFn: () => mockFetch(getCustomTourRequests()),
  });
}

export function useCustomTourRequest(id: string) {
  return useQuery({
    queryKey: customTourKeys.request(id),
    queryFn: async () => {
      const r = getCustomTourRequest(id);
      if (!r) throw new Error("Not found");
      const proposal = getProposalForRequest(id);
      return mockFetch({ request: r, proposal });
    },
    enabled: Boolean(id),
  });
}

export function useCustomTourRequestByRef(reference: string) {
  return useQuery({
    queryKey: customTourKeys.requestRef(reference),
    queryFn: async () => {
      const r = getCustomTourRequestByRef(reference);
      if (!r) throw new Error("Not found");
      const proposal = r.proposalId ? getProposal(r.proposalId) : undefined;
      return mockFetch({ request: r, proposal });
    },
    enabled: Boolean(reference),
  });
}

export function useCreateCustomTourRequest() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Omit<
        CreateCustomTourRequestInput,
        "userId" | "customerName"
      > & { userId?: string; customerName?: string },
    ) => {
      const uid = input.userId ?? user!.id;
      const name = input.customerName ?? user!.fullName;
      return mockFetch(
        createCustomTourRequest({
          ...input,
          userId: uid,
          customerName: name,
        }),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customTourRequests"] });
    },
  });
}

export function useSubmitCustomProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Parameters<typeof submitCustomProposal>[0]) =>
      mockFetch(submitCustomProposal(input)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: customTourKeys.allRequests });
      qc.invalidateQueries({ queryKey: customTourKeys.request(vars.requestId) });
    },
  });
}

export function useConfirmCustomTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      staffName,
    }: {
      id: string;
      staffName: string;
    }) => mockFetch(confirmCustomTourRequest(id, staffName)!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customTourRequests"] }),
  });
}

export function useRejectCustomTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      reason,
      staffName,
    }: {
      id: string;
      reason: string;
      staffName: string;
    }) => mockFetch(rejectCustomTourRequest(id, reason, staffName)!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customTourRequests"] }),
  });
}

export function useAcceptCustomProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (proposalId: string) =>
      mockFetch(acceptProposal(proposalId)!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customTourRequests"] }),
  });
}

export function useAssignCustomTourReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      staffId,
      staffName,
    }: {
      id: string;
      staffId: string;
      staffName: string;
    }) =>
      mockFetch(
        updateCustomTourRequest(id, {
          status: "under_review",
          assignedStaffId: staffId,
          assignedStaffName: staffName,
        })!,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: customTourKeys.allRequests }),
  });
}
