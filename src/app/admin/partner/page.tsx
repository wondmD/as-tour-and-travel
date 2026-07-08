"use client";

import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Skeleton,
  toast,
} from "@/components/ui";
import { usePartnerRooms } from "@/lib/hooks/use-travel-data";
import { useSession } from "@/lib/stores/auth";

/** Partner portal — hotel inventory management (role: partner). */
export default function PartnerInventoryPage() {
  const session = useSession();
  const partnerId = session?.user.id;
  const partnerName = session?.user.partnerName ?? "Partner property";
  const { data: rooms, isLoading } = usePartnerRooms(partnerId);

  return (
    <>
      <PageHeader
        title={partnerName}
        description="Manage room inventory, rates, and availability for your property."
        actions={
          <Button size="sm" onClick={() => toast.info("Rate calendar — mock")}>
            Update rates
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
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
                  <Button
                    className="mt-3"
                    size="sm"
                    variant="soft"
                    fullWidth
                    onClick={() => toast.info("Inventory editor — mock")}
                  >
                    Edit inventory
                  </Button>
                </CardContent>
              </Card>
            ))}
      </div>
    </>
  );
}
