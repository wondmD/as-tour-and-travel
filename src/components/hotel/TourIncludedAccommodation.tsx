"use client";

import Link from "next/link";
import { BedDouble, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { HotelFulfillmentBadge } from "@/components/hotel/HotelBadges";
import { useTourIncludedStays } from "@/lib/hooks/use-hotel-data";

export function TourIncludedAccommodation({ tourId }: { tourId: string }) {
  const { data: stays, isLoading } = useTourIncludedStays(tourId);

  if (isLoading || !stays?.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          Included accommodation
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Hotels and apartments bundled with your tour — upgrades available at checkout.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {stays.map((stay) => (
          <Card key={stay.id} static>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BedDouble className="size-4 text-primary" />
                Day {stay.dayNumber} · {stay.dayLabel}
              </CardTitle>
              <CardDescription>
                {stay.nights} night{stay.nights > 1 ? "s" : ""} · {stay.city}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-medium text-text-primary">{stay.hotelName}</p>
              <p className="text-text-secondary">
                Included: <strong>{stay.roomTypeName}</strong>
              </p>
              {stay.upgradeRoomTypeName && stay.upgradePriceUsd && (
                <p className="flex items-center gap-1.5 text-accent">
                  <Sparkles className="size-3.5" />
                  Upgrade to {stay.upgradeRoomTypeName} (+$
                  {stay.upgradePriceUsd}/night)
                </p>
              )}
              <Link href={`/hotels/${stay.hotelId}`}>
                <Button variant="soft" size="sm">
                  View property · add extra nights
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-5">
        <p className="text-sm font-medium text-text-primary">
          Need nights before or after your tour?
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          AS Tour apartments in Addis and Bahir Dar offer instant confirmation when available.
        </p>
        <Link href="/hotels?instantOnly=1">
          <Button className="mt-3" size="sm">
            Browse add-on stays
          </Button>
        </Link>
      </div>
    </section>
  );
}
