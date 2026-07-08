"use client";

import Link from "next/link";
import { ArrowRight, Headphones, MapPin, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui";
import {
  AssistanceBadge,
  TransportTypeBadge,
} from "@/components/transport/TransportBadges";
import { useTourIncludedTransfers, useTourTravelPlan } from "@/lib/hooks/use-transport-data";

export function TourTravelAssistance({
  tourId,
  tourSlug,
}: {
  tourId: string;
  tourSlug: string;
}) {
  const { data: plan, isLoading: planLoading } = useTourTravelPlan(tourId);
  const { data: included, isLoading: includedLoading } =
    useTourIncludedTransfers(tourId);

  if (planLoading || includedLoading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!included?.length && !plan?.legs?.length) return null;

  return (
    <section className="border-y border-border/60 bg-secondary/5 py-12">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="pill-badge mb-3">Effortless travel</span>
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              We help you move place to place
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              AS Tour &amp; Travel does not only plan your route — we coordinate flights,
              coaches, and private transfers so you travel across Ethiopia effortlessly,
              with meet-and-greet assistance at every leg.
            </p>
          </div>
          <Link href={`/transport?tourId=${tourId}&tourSlug=${tourSlug}`}>
            <Button variant="soft" size="sm">
              Book extra transfers
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Included coordination",
              text: "Airport pickups, hotel transfers, and inter-city legs arranged by our team",
            },
            {
              icon: Headphones,
              title: "On-road assistance",
              text: "English-speaking drivers and coordinators — help with luggage, stops, and timing",
            },
            {
              icon: MapPin,
              title: "Door to door",
              text: "Clear meeting points and pickup times sent before each travel day",
            },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title} static variant="solid">
              <CardContent className="pt-6">
                <Icon className="size-8 text-primary" strokeWidth={1.5} />
                <h3 className="mt-3 font-heading font-bold text-text-primary">{title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {included && included.length > 0 && (
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary">
              Transfers included on this tour
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {included.map((xfer) => (
                <Card key={xfer.id} static>
                  <CardHeader
                    actions={
                      <span className="flex gap-2">
                        <TransportTypeBadge type={xfer.routeType} />
                        {xfer.included && (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                            Included
                          </span>
                        )}
                      </span>
                    }
                  >
                    <CardTitle className="text-base">
                      {xfer.dayLabel} · {xfer.legLabel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-text-secondary">
                    {xfer.assistanceNotes}
                    {xfer.upgradePriceUsd != null && xfer.upgradePriceUsd > 0 && (
                      <p className="mt-2 text-xs text-accent">
                        Flight upgrade from +${xfer.upgradePriceUsd}/person
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {plan?.legs && plan.legs.length > 0 && (
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary">
              Route legs between destinations
            </h3>
            <ol className="mt-4 space-y-2">
              {plan.legs.map((leg) => (
                <li
                  key={leg.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-white/60 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-text-primary">{leg.fromName}</span>
                  <ArrowRight className="size-4 text-text-secondary" />
                  <span className="font-semibold text-text-primary">{leg.toName}</span>
                  <span className="text-text-secondary">· {leg.travelDate}</span>
                  {leg.includedInPackage && (
                    <AssistanceBadge coordinated />
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
