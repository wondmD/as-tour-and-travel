"use client";

import Image from "next/image";
import Link from "next/link";
import { Film, Images } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { useTourMemories } from "@/lib/hooks/use-custom-tour-data";

export function TourMemoriesSection({ tourId, tourSlug }: { tourId: string; tourSlug: string }) {
  const { data: memories } = useTourMemories(tourId);

  if (!memories?.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            Departure memories
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Photos and videos from past group departures — relive the journey.
          </p>
        </div>
        <Link href={`/tours/${tourSlug}/memories`}>
          <Button variant="soft" size="sm">
            <Images className="size-4" /> View all
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((mem) => (
          <Link key={mem.id} href={`/tours/${tourSlug}/memories/${mem.id}`}>
            <Card static className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="relative aspect-video bg-primary/5">
                <Image
                  src={mem.coverImage}
                  alt={mem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">{mem.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-secondary">
                {mem.participantCount} travelers · {mem.media.length} items
                {mem.media.some((m) => m.type === "video") && (
                  <span className="ms-2 inline-flex items-center gap-0.5">
                    <Film className="size-3" /> video
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
