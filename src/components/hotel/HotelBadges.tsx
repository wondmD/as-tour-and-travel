"use client";

import { Badge } from "@/components/ui/Badge";
import { fulfillmentLabel } from "@/lib/hotel-booking";
import type { HotelFulfillmentType, HotelOwnerType, PropertyKind } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Bolt, Building2, Clock, Home, Hotel } from "lucide-react";

const KIND_ICON: Record<PropertyKind, typeof Hotel> = {
  hotel: Hotel,
  apartment: Home,
  guesthouse: Building2,
};

export function HotelKindIcon({
  kind,
  className,
}: {
  kind: PropertyKind;
  className?: string;
}) {
  const Icon = KIND_ICON[kind];
  return <Icon className={cn("size-4", className)} />;
}

export function HotelFulfillmentBadge({
  type,
  className,
}: {
  type: HotelFulfillmentType;
  className?: string;
}) {
  const variant =
    type === "instant"
      ? "success"
      : type === "allotment"
        ? "primary"
        : "warning";

  return (
    <Badge variant={variant} className={cn("gap-1", className)}>
      {type === "instant" || type === "allotment" ? (
        <Bolt className="size-3" />
      ) : (
        <Clock className="size-3" />
      )}
      {fulfillmentLabel(type)}
    </Badge>
  );
}

export function HotelOwnerBadge({ ownerType }: { ownerType: HotelOwnerType }) {
  if (ownerType === "as_tour") {
    return <Badge variant="accent">AS Tour property</Badge>;
  }
  if (ownerType === "partner") {
    return <Badge variant="info">Partner</Badge>;
  }
  return <Badge variant="neutral">External</Badge>;
}

export function HotelBookingStatusBadge({
  status,
}: {
  status: string;
}) {
  const map: Record<string, "success" | "warning" | "danger" | "neutral" | "info"> = {
    confirmed: "success",
    pending_confirmation: "warning",
    declined: "danger",
    cancelled: "neutral",
    checked_in: "info",
    completed: "success",
  };
  const label = status.replace(/_/g, " ");
  return (
    <Badge variant={map[status] ?? "neutral"} dot>
      {label}
    </Badge>
  );
}
