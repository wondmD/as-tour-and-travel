"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard";
import { Spinner } from "@/components/ui";
import { useTourMemories } from "@/lib/hooks/use-custom-tour-data";

export default function AccountMemoriesPage() {
  const { data: memories, isLoading } = useTourMemories();

  return (
    <>
      <PageHeader
        title="Tour memories"
        description="Photos and videos from group departures you can browse as a traveler."
      />
      {isLoading ? (
        <Spinner label="Loading…" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memories?.map((mem) => (
            <Link
              key={mem.id}
              href={`/tours/${mem.tourSlug}/memories/${mem.id}`}
              className="glass-card overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-video">
                <Image src={mem.coverImage} alt="" fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-text-primary">{mem.title}</p>
                <p className="mt-1 text-xs text-text-secondary">{mem.tourTitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
