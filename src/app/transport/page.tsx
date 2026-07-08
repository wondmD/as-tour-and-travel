"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TransportSearchForm } from "@/components/transport/TransportSearchForm";
import {
  AssistanceBadge,
  TransportTypeBadge,
} from "@/components/transport/TransportBadges";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui";
import { useTransportSearch } from "@/lib/hooks/use-transport-data";
import { formatDuration, fulfillmentLabel } from "@/lib/transport-booking";
import type { TransportSearchQuery } from "@/lib/types";

function TransportResults() {
  const params = useSearchParams();
  const tourId = params.get("tourId") ?? undefined;
  const [query, setQuery] = useState<TransportSearchQuery | null>(() => {
    const travelDate = params.get("travelDate");
    if (!travelDate) return null;
    return {
      travelDate,
      passengers: Number(params.get("passengers") ?? "2"),
      originDestinationId: params.get("from") ?? undefined,
      destinationDestinationId: params.get("to") ?? undefined,
      type: (params.get("type") as TransportSearchQuery["type"]) ?? undefined,
    };
  });

  const { data: results, isLoading } = useTransportSearch(
    query ?? { travelDate: "", passengers: 2 },
    Boolean(query),
  );

  return (
    <>
      <TransportSearchForm
        initial={{
          travelDate: params.get("travelDate") ?? undefined,
          passengers: Number(params.get("passengers") ?? "2"),
          originDestinationId: params.get("from") ?? undefined,
          destinationDestinationId: params.get("to") ?? undefined,
          tourId,
        }}
        onSearch={(values) => {
          setQuery({
            travelDate: values.travelDate,
            passengers: values.passengers,
            originDestinationId: values.originDestinationId,
            destinationDestinationId: values.destinationDestinationId,
            type: values.type as TransportSearchQuery["type"],
          });
        }}
      />

      <div className="mt-8">
        {!query ? (
          <p className="text-sm text-text-secondary">
            Search for flights, coaches, or private transfers — AS Tour coordinates
            pickup and on-road assistance so you travel effortlessly.
          </p>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : !results?.length ? (
          <p className="text-sm text-text-secondary">
            No routes match. Try different destinations or contact us for a custom
            transfer.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map(({ route, totalUsd, fulfillmentType, assistanceIncluded }) => (
              <Card key={route.id} static>
                <CardHeader
                  actions={
                    <span className="flex flex-wrap gap-1.5">
                      <TransportTypeBadge type={route.type} />
                      {assistanceIncluded && <AssistanceBadge coordinated />}
                    </span>
                  }
                >
                  <CardTitle className="text-lg">
                    {route.origin} → {route.destination}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-text-secondary">
                    {route.operator} · {formatDuration(route.durationMinutes)}
                  </p>
                  <Badge variant="neutral">{fulfillmentLabel(fulfillmentType)}</Badge>
                  <p>
                    From{" "}
                    <strong className="text-lg text-text-primary">
                      ${totalUsd.toLocaleString()}
                    </strong>
                    {query && query.passengers > 1 && (
                      <span className="text-text-secondary">
                        {" "}
                        for {query.passengers} travelers
                      </span>
                    )}
                  </p>
                  <Link
                    href={`/transport/${route.id}?date=${query?.travelDate}&passengers=${query?.passengers}${tourId ? `&tourId=${tourId}` : ""}${params.get("tourRef") ? `&tourRef=${params.get("tourRef")}` : ""}`}
                  >
                    <Button size="sm" variant="soft">
                      Book with assistance
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function TransportPage() {
  return (
    <>
      <Navbar />
      <main className="pattern-surface min-h-dvh py-12">
        <div className="mx-auto max-w-4xl space-y-4 px-4 sm:px-6">
          <div>
            <Badge variant="primary" dot>
              Travel assistance
            </Badge>
            <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">
              Move across Ethiopia effortlessly
            </h1>
            <p className="mt-2 text-text-secondary">
              Book flights, coaches, and private transfers — our team coordinates every
              leg so you focus on the journey, not the logistics.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
            <TransportResults />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
