"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HotelSearchForm } from "@/components/hotel/HotelSearchForm";
import {
  HotelFulfillmentBadge,
  HotelKindIcon,
  HotelOwnerBadge,
} from "@/components/hotel/HotelBadges";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui";
import { useHotelSearch } from "@/lib/hooks/use-hotel-data";

function HotelsResults() {
  const params = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  const checkIn = params.get("checkIn") ?? today;
  const checkOut = params.get("checkOut") ?? "";
  const guests = Number(params.get("guests") ?? "2");
  const city = params.get("city") ?? undefined;
  const instantOnly = params.get("instantOnly") === "1";

  const hasSearch = Boolean(checkOut);
  const { data: results, isLoading } = useHotelSearch(
    { checkIn, checkOut, guests, city, instantOnly },
    hasSearch,
  );

  if (!hasSearch) {
    return (
      <p className="text-sm text-text-secondary">
        Enter dates above to search available properties.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!results?.length) {
    return (
      <p className="text-sm text-text-secondary">
        No properties match your search. Try different dates or disable instant-only filter.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {results.map(({ hotel, fromRateUsd, instantBook }) => (
        <Card key={hotel.id} static>
          <CardHeader
            actions={
              <span className="flex flex-wrap gap-1.5">
                <HotelFulfillmentBadge type={hotel.fulfillmentType} />
                {instantBook && hotel.fulfillmentType === "on_request" && (
                  <Badge variant="success">Available</Badge>
                )}
              </span>
            }
          >
            <CardTitle className="flex items-center gap-2 text-lg">
              <HotelKindIcon kind={hotel.kind} className="text-primary" />
              {hotel.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-text-secondary">
              {hotel.city} · {hotel.stars}★ · from{" "}
              <strong className="text-text-primary">${fromRateUsd}/night</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              <HotelOwnerBadge ownerType={hotel.ownerType} />
            </div>
            {hotel.description && (
              <p className="line-clamp-2 text-text-secondary">{hotel.description}</p>
            )}
            <Link
              href={`/hotels/${hotel.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
            >
              <Button size="sm" variant="soft">
                View & book
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HotelsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--page-bg)] pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-text-primary">
              Hotels & apartments
            </h1>
            <p className="mt-2 max-w-2xl text-text-secondary">
              Add nights before or after your tour. AS Tour apartments confirm instantly;
              partner and external properties use allotment or on-request confirmation.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-32 rounded-2xl" />}>
            <HotelSearchForm />
          </Suspense>
          <div className="mt-8">
            <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
              <HotelsResults />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
