"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HotelBookingPanel } from "@/components/hotel/HotelBookingPanel";
import {
  HotelFulfillmentBadge,
  HotelKindIcon,
  HotelOwnerBadge,
} from "@/components/hotel/HotelBadges";
import { Badge, Skeleton, Spinner } from "@/components/ui";
import { useHotelProperty } from "@/lib/hooks/use-hotel-data";

function HotelDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const today = new Date().toISOString().slice(0, 10);
  const checkIn = searchParams.get("checkIn") ?? today;
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = Number(searchParams.get("guests") ?? "2");
  const tourRef = searchParams.get("tourRef") ?? undefined;

  const { data, isLoading } = useHotelProperty(id);

  if (isLoading) return <Spinner label="Loading property…" />;
  if (!data) return <p>Property not found.</p>;

  const { hotel, rooms } = data;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <HotelKindIcon kind={hotel.kind} className="size-6 text-primary" />
            <h1 className="font-heading text-3xl font-bold text-text-primary">
              {hotel.name}
            </h1>
          </div>
          <p className="mt-2 text-text-secondary">
            {hotel.address ?? hotel.city} · {hotel.stars}★
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <HotelFulfillmentBadge type={hotel.fulfillmentType} />
            <HotelOwnerBadge ownerType={hotel.ownerType} />
            <Badge variant="neutral">{hotel.kind}</Badge>
          </div>
        </div>

        {hotel.description && (
          <p className="text-sm leading-relaxed text-text-secondary">
            {hotel.description}
          </p>
        )}

        {hotel.amenities && (
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Amenities</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {hotel.amenities.map((a) => (
                <Badge key={a} variant="outline">
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-text-primary">Room types</h2>
          <ul className="mt-3 space-y-3">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="rounded-xl border border-border/80 bg-white/60 px-4 py-3 text-sm"
              >
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-text-primary">{room.name}</span>
                  <span className="font-semibold tabular-nums text-primary">
                    ${room.rateUsd}/night
                  </span>
                </div>
                <p className="mt-1 text-text-secondary">
                  Up to {room.maxGuests} guests
                  {room.description ? ` · ${room.description}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/hotels" className="text-sm font-medium text-primary hover:underline">
          ← Back to search
        </Link>
      </div>

      <div className="lg:col-span-2">
        {checkOut ? (
          <HotelBookingPanel
            hotel={hotel}
            rooms={rooms}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            linkedTourBookingRef={tourRef}
          />
        ) : (
          <div className="glass-card p-5 text-sm text-text-secondary">
            <p>Add check-in and check-out dates via search to book.</p>
            <Link href={`/hotels?city=${encodeURIComponent(hotel.city)}`}>
              <span className="mt-2 inline-block font-medium text-primary">
                Search with dates →
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--page-bg)] pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <HotelDetailContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
