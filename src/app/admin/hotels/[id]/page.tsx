"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  HotelFulfillmentBadge,
  HotelKindIcon,
  HotelOwnerBadge,
} from "@/components/hotel/HotelBadges";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
  Spinner,
  toast,
} from "@/components/ui";
import {
  useHotelProperty,
  usePropertyInventory,
  useUpdateRoomInventory,
} from "@/lib/hooks/use-hotel-data";

export default function AdminHotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading } = useHotelProperty(id);
  const { data: inventory } = usePropertyInventory(id);
  const updateRoom = useUpdateRoomInventory();
  const canEdit = useRequireRole(["admin", "staff"]);

  if (isLoading) return <Spinner label="Loading…" />;
  if (!data) return <p>Not found</p>;

  const { hotel, rooms } = data;

  return (
    <>
      <PageHeader
        title={hotel.name}
        description={`${hotel.city} · ${hotel.kind} · ${hotel.fulfillmentType} fulfillment`}
        actions={
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/hotels")}>
            All properties
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <HotelFulfillmentBadge type={hotel.fulfillmentType} />
        <HotelOwnerBadge ownerType={hotel.ownerType} />
        <Badge variant={hotel.status === "active" ? "success" : "neutral"}>
          {hotel.status}
        </Badge>
      </div>

      {hotel.description && (
        <p className="mb-6 max-w-2xl text-sm text-text-secondary">{hotel.description}</p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card static>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HotelKindIcon kind={hotel.kind} />
              Room inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms.map((room) => {
              const pct =
                room.total > 0
                  ? Math.round(((room.total - room.available) / room.total) * 100)
                  : 0;
              return (
                <div key={room.id} className="rounded-xl border border-border/80 p-4">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{room.name}</span>
                    <Badge variant="primary">${room.rateUsd}/night</Badge>
                  </div>
                  <Progress
                    className="mt-2"
                    value={room.total - room.available}
                    max={room.total}
                    tone={pct >= 90 ? "warning" : "primary"}
                    label={`${room.available} of ${room.total} available today`}
                  />
                  {canEdit && (
                    <div className="mt-3">
                      <Label htmlFor={`avail-${room.id}`} className="text-xs">
                        Available units (today)
                      </Label>
                      <Input
                        id={`avail-${room.id}`}
                        type="number"
                        className="mt-1 max-w-24"
                        defaultValue={room.available}
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (!Number.isNaN(v)) {
                            updateRoom.mutate({
                              roomId: room.id,
                              hotelId: id,
                              patch: { available: v },
                            });
                            toast.success("Inventory updated");
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card static>
          <CardHeader>
            <CardTitle className="text-base">14-day availability snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {inventory?.slice(0, 28).map((night) => {
              const free = night.totalUnits - night.bookedUnits - night.heldUnits;
              return (
                <div
                  key={night.id}
                  className="flex justify-between rounded-lg bg-primary/4 px-2 py-1.5 tabular-nums"
                >
                  <span>{night.date}</span>
                  <span className="text-text-secondary">
                    {free}/{night.totalUnits} free
                  </span>
                </div>
              );
            })}
            {!inventory?.length && (
              <p className="text-sm text-text-secondary">
                No night-level inventory — on-request property.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {hotel.fulfillmentType === "on_request" && (
        <Card static className="mt-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
            <p className="text-text-secondary">
              Bookings require manual confirmation within{" "}
              {hotel.confirmationSlaHours ?? 24} hours.
            </p>
            <Button
              size="sm"
              onClick={() => router.push("/admin/hotels/confirmations")}
            >
              Open confirmation queue
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
