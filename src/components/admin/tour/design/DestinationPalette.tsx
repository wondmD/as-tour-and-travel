"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { destinationCoverImage } from "@/lib/tour-itinerary";
import type { Destination } from "@/lib/types";
import { cn } from "@/lib/cn";

interface DestinationPaletteProps {
  destinations: Destination[];
  usedDestinationIds: Set<string>;
  onAdd: (destination: Destination) => void;
}

export function DestinationPalette({
  destinations,
  usedDestinationIds,
  onAdd,
}: DestinationPaletteProps) {
  const published = destinations.filter((d) => d.status === "published");

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-secondary">
        Click a destination to schedule it on the route. Arrival date defaults to the next
        available day after the previous stop.
      </p>
      <div className="grid gap-2">
        {published.map((dest) => {
          const used = usedDestinationIds.has(dest.id);
          const cover = destinationCoverImage(dest.id);

          return (
            <button
              key={dest.id}
              type="button"
              disabled={used}
              onClick={() => onAdd(dest)}
              className={cn(
                "group flex items-center gap-3 rounded-xl border p-2 text-start transition-all",
                used
                  ? "cursor-not-allowed border-border/40 bg-black/[0.02] opacity-50"
                  : "border-border/60 bg-white/70 hover:border-primary/40 hover:shadow-sm",
              )}
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                <Image src={cover} alt="" fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-text-primary">{dest.name}</p>
                <p className="text-xs text-text-secondary">{dest.country}</p>
                <p className="mt-0.5 text-[10px] text-text-secondary">
                  Best: {dest.bestSeason}
                </p>
              </div>
              {used ? (
                <Badge variant="neutral">On route</Badge>
              ) : (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <Plus className="size-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {published.length === 0 && (
        <p className="text-sm text-text-secondary">No published destinations in catalog.</p>
      )}
    </div>
  );
}
