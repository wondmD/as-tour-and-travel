"use client";

import { MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Progress,
  Spinner,
} from "@/components/ui";
import { useTrips } from "@/lib/hooks/use-travel-data";

export default function TripsPage() {
  const { data, isLoading } = useTrips();

  return (
    <>
      <PageHeader
        title="My trips"
        description="Plan routes, organize days, and save itineraries for offline access."
        actions={
          <Button size="sm" onClick={() => {}}>
            <Plus className="size-4" /> New trip plan
          </Button>
        }
      />

      {isLoading ? (
        <Spinner label="Loading trips…" />
      ) : !data?.length ? (
        <EmptyState
          icon={MapPin}
          title="No trip plans yet"
          description="Create a named trip and add destinations day by day."
          action={<Button size="sm">Create trip plan</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((trip) => (
            <Card key={trip.id}>
              <CardHeader actions={<Badge variant="primary">{trip.status}</Badge>}>
                <CardTitle>{trip.name}</CardTitle>
                <CardDescription>
                  {trip.startDate && trip.endDate
                    ? `${trip.startDate} → ${trip.endDate}`
                    : "Dates not set"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">{trip.itemCount} stops planned</p>
                <Progress
                  className="mt-3"
                  value={trip.status === "planning" ? 35 : 80}
                  label="Itinerary progress"
                  showValue
                />
                <Button className="mt-4" size="sm" variant="soft" fullWidth>
                  Open planner
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
