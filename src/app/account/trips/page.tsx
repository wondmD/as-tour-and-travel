"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Spinner,
} from "@/components/ui";
import { TravelPlanStatusBadge } from "@/components/travel/TravelDesignerParts";
import { routeSummary } from "@/lib/travel-plan";
import { useMyTravelPlans } from "@/lib/hooks/use-travel-plan-data";

export default function TripsPage() {
  const router = useRouter();
  const { data, isLoading } = useMyTravelPlans();

  return (
    <>
      <PageHeader
        title="My trips"
        description="Travel plans and routes — international, domestic, and multi-country."
        actions={
          <Link href="/travel/design">
            <Button size="sm">
              <Plus className="size-4" /> New travel plan
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <Spinner label="Loading trips…" />
      ) : !data?.length ? (
        <EmptyState
          icon={MapPin}
          title="No travel plans yet"
          description="Design a route with simple city stops — to Ethiopia, from Ethiopia, or within the country."
          action={
            <Link href="/travel/design">
              <Button size="sm">Design travel</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((trip) => (
            <Card
              key={trip.id}
              className="cursor-pointer"
              onClick={() => router.push(`/account/travel/${trip.reference}`)}
            >
              <CardHeader actions={<TravelPlanStatusBadge status={trip.status} />}>
                <CardTitle>{trip.name}</CardTitle>
                <CardDescription>
                  {trip.startDate}
                  {trip.endDate ? ` → ${trip.endDate}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {routeSummary(trip.stops)} · {trip.travelerCount} traveler
                  {trip.travelerCount === 1 ? "" : "s"}
                </p>
                <Link href={`/account/travel/${trip.reference}`} className="mt-4 block">
                  <Button size="sm" variant="soft" fullWidth>
                    View plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
