"use client";

import { Badge } from "@/components/ui/Badge";
import { tourTypeSupportsMemory, type TourType } from "@/lib/types";
import { TOUR_TYPE_LABELS } from "@/lib/tour-labels";
import { Camera, Lock, Users, Wand2 } from "lucide-react";
import { cn } from "@/lib/cn";

const ICONS: Record<TourType, typeof Users> = {
  group_departure: Users,
  semi_private: Users,
  private: Lock,
  custom: Wand2,
};

export function TourTypeBadge({
  tourType,
  showMemoryHint,
  className,
}: {
  tourType: TourType;
  showMemoryHint?: boolean;
  className?: string;
}) {
  const Icon = ICONS[tourType];
  const variant =
    tourType === "private"
      ? "neutral"
      : tourType === "custom"
        ? "accent"
        : "primary";

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
      <Badge variant={variant} className="gap-1">
        <Icon className="size-3" />
        {TOUR_TYPE_LABELS[tourType]}
      </Badge>
      {showMemoryHint && tourTypeSupportsMemory(tourType) && (
        <Badge variant="outline" className="gap-1">
          <Camera className="size-3" />
          Departure memories
        </Badge>
      )}
    </span>
  );
}

export function CustomTourStatusBadge({ status }: { status: string }) {
  const map: Record<string, "success" | "warning" | "danger" | "neutral" | "info" | "primary"> = {
    submitted: "info",
    under_review: "warning",
    customized: "primary",
    confirmed: "success",
    rejected: "danger",
  };
  return (
    <Badge variant={map[status] ?? "neutral"} dot>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
