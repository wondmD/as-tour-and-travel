"use client";

import { Bus, Car, Plane } from "lucide-react";
import { Badge, StatusBadge, type StatusKind } from "@/components/ui";
import type { TransportBookingStatus, TransportRoute } from "@/lib/types";
import { cn } from "@/lib/cn";

export function TransportTypeIcon({
  type,
  className,
}: {
  type: TransportRoute["type"];
  className?: string;
}) {
  const Icon = type === "flight" ? Plane : type === "bus" ? Bus : Car;
  return <Icon className={cn("size-4", className)} />;
}

export function TransportTypeBadge({ type }: { type: TransportRoute["type"] }) {
  const variant =
    type === "flight" ? "info" : type === "private_car" ? "primary" : "neutral";
  return (
    <Badge variant={variant} className="gap-1">
      <TransportTypeIcon type={type} className="size-3" />
      {type === "private_car" ? "Private" : type === "flight" ? "Flight" : "Coach"}
    </Badge>
  );
}

const STATUS_MAP: Record<TransportBookingStatus, StatusKind> = {
  pending_confirmation: "pending",
  confirmed: "confirmed",
  in_transit: "active",
  completed: "completed",
  cancelled: "cancelled",
  declined: "cancelled",
};

export function TransportBookingStatusBadge({
  status,
}: {
  status: TransportBookingStatus;
}) {
  return <StatusBadge status={STATUS_MAP[status]} label={status.replace(/_/g, " ")} />;
}

export function AssistanceBadge({ coordinated }: { coordinated: boolean }) {
  if (!coordinated) return null;
  return (
    <Badge variant="success" dot>
      AS Tour assisted
    </Badge>
  );
}
