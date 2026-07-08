"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Film } from "lucide-react";
import { Button, Spinner } from "@/components/ui";
import { useTourMemories } from "@/lib/hooks/use-custom-tour-data";
import { useTours } from "@/lib/hooks/use-travel-data";

export default function TourMemoriesListPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: tours } = useTours();
  const tour = tours?.find((t) => t.slug === slug);
  const { data: memories, isLoading } = useTourMemories(tour?.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--page-bg)] pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href={`/tours/${slug}`} className="text-sm font-medium text-primary hover:underline">
            ← Back to tour
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold text-text-primary">
            Departure memories
          </h1>
          <p className="mt-1 text-text-secondary">
            {tour?.title ?? slug} — photos and videos from past group departures.
          </p>

          {isLoading ? (
            <Spinner className="mt-12" label="Loading…" />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {memories?.map((mem) => (
                <Link
                  key={mem.id}
                  href={`/tours/${slug}/memories/${mem.id}`}
                  className="glass-card overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video">
                    <Image src={mem.coverImage} alt="" fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h2 className="font-heading text-lg font-semibold">{mem.title}</h2>
                    <p className="mt-1 text-sm text-text-secondary">{mem.summary}</p>
                    <p className="mt-2 text-xs text-text-secondary">
                      {mem.media.length} items
                      {mem.media.some((m) => m.type === "video") && (
                        <Film className="ms-1 inline size-3.5" />
                      )}
                    </p>
                  </div>
                </Link>
              ))}
              {!memories?.length && (
                <p className="text-sm text-text-secondary">No memories published yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
