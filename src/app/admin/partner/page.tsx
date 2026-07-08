"use client";

import { PageHeader } from "@/components/dashboard";
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
  Skeleton,
  toast,
} from "@/components/ui";
import { HotelFulfillmentBadge } from "@/components/hotel/HotelBadges";
import {
  useHotelProperty,
  usePartnerRooms,
  useUpdateRoomInventory,
} from "@/lib/hooks/use-hotel-data";
import { useSession } from "@/lib/stores/auth";

const PARTNER_HOTEL_ID = "htl-1";

/** Partner portal — room inventory for contracted properties. */
export default function PartnerInventoryPage() {
  const session = useSession();
  const partnerId = session?.user.id;
  const partnerName = session?.user.partnerName ?? "Partner property";
  const { data: property, isLoading: propLoading } = useHotelProperty(PARTNER_HOTEL_ID);
  const { data: rooms, isLoading } = usePartnerRooms(partnerId);
  const updateRoom = useUpdateRoomInventory();

  return (
    <>
      <PageHeader
        title={partnerName}
        description="Update room availability for your contracted allotment — travelers get instant confirmation while units remain."
        actions={
          <Button size="sm" onClick={() => toast.info("Rate calendar — mock")}>
            Bulk rate update
          </Button>
        }
      />

      {property?.hotel && (
        <div className="mb-4">
          <HotelFulfillmentBadge type={property.hotel.fulfillmentType} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading || propLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))
          : rooms?.map((room) => (
              <Card key={room.id} static>
                <CardHeader actions={<Badge variant="primary">${room.rateUsd}/night</Badge>}>
                  <CardTitle className="text-base">{room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={room.total - room.available}
                    max={room.total}
                    label={`${room.available} rooms available`}
                    showValue
                  />
                  <div className="mt-3 space-y-2">
                    <Label htmlFor={`p-${room.id}`} className="text-xs">
                      Available units
                    </Label>
                    <Input
                      id={`p-${room.id}`}
                      type="number"
                      defaultValue={room.available}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v)) {
                          updateRoom.mutate({
                            roomId: room.id,
                            hotelId: PARTNER_HOTEL_ID,
                            patch: { available: v },
                          });
                          toast.success("Allotment updated");
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </>
  );
}
