"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Film, Play } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge, Spinner } from "@/components/ui";
import { useTourMemory } from "@/lib/hooks/use-custom-tour-data";

export default function TourMemoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const memoryId = params.memoryId as string;
  const { data: memory, isLoading } = useTourMemory(memoryId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--page-bg)] pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {isLoading || !memory ? (
            <Spinner label="Loading gallery…" />
          ) : (
            <>
              <Link
                href={`/tours/${slug}/memories`}
                className="text-sm font-medium text-primary hover:underline"
              >
                ← All memories
              </Link>
              <h1 className="mt-4 font-heading text-3xl font-bold text-text-primary">
                {memory.title}
              </h1>
              <p className="mt-1 text-text-secondary">{memory.summary}</p>
              <p className="mt-2 text-xs text-text-secondary">
                Departure {memory.departureDate} · {memory.participantCount} travelers
              </p>

              <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
                {memory.media.map((item) => (
                  <figure
                    key={item.id}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/80 bg-white/60"
                  >
                    <div className="relative aspect-[4/3] bg-primary/5">
                      <Image
                        src={item.thumbnailUrl ?? item.url}
                        alt={item.caption ?? ""}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                      {item.type === "video" && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Badge variant="neutral" className="gap-1 bg-white/90">
                            <Play className="size-3" />
                            Video{item.durationSec ? ` · ${item.durationSec}s` : ""}
                          </Badge>
                        </span>
                      )}
                      {item.type === "photo" && (
                        <span className="absolute right-2 top-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                          Photo
                        </span>
                      )}
                    </div>
                    {item.caption && (
                      <figcaption className="px-3 py-2 text-sm text-text-secondary">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
