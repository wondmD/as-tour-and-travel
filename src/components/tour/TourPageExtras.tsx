"use client";

import Link from "next/link";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui";
import { TourTypeBadge } from "@/components/tour/TourTypeBadge";
import { TourMemoriesSection } from "@/components/tour/TourMemoriesSection";
import { TourTravelAssistance } from "@/components/transport/TourTravelAssistance";
import { TOUR_TYPE_DESCRIPTIONS } from "@/lib/tour-labels";
import { tourTypeSupportsMemory, type TourType } from "@/lib/types";

export function TourPageExtras({
  tourId,
  tourSlug,
  tourType,
}: {
  tourId: string;
  tourSlug: string;
  tourType: TourType;
}) {
  return (
    <>
      <section className="border-y border-border/60 bg-primary/4 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div>
            <TourTypeBadge tourType={tourType} showMemoryHint />
            <p className="mt-2 max-w-xl text-sm text-text-secondary">
              {TOUR_TYPE_DESCRIPTIONS[tourType]}
            </p>
          </div>
          <Link href="/tours/request">
            <Button variant="soft" size="sm">
              <Wand2 className="size-4" /> Build a custom tour
            </Button>
          </Link>
        </div>
      </section>
      {tourTypeSupportsMemory(tourType) && (
        <TourMemoriesSection tourId={tourId} tourSlug={tourSlug} />
      )}
      <TourTravelAssistance tourId={tourId} tourSlug={tourSlug} />
    </>
  );
}
