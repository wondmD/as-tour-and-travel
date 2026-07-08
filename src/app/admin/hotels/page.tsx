"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
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
  DataTable,
  toast,
} from "@/components/ui";
import { usePendingHotelBookings } from "@/lib/hooks/use-hotel-data";
import { useHotels } from "@/lib/hooks/use-travel-data";
import type { Hotel } from "@/lib/types";

type HotelRow = Hotel & { pendingCount?: number };

export default function AdminHotelsPage() {
  const router = useRouter();
  const { data: hotels, isLoading } = useHotels();
  const { data: pending } = usePendingHotelBookings();
  const canEdit = useRequireRole(["admin", "staff"]);

  const pendingByHotel = new Map<string, number>();
  pending?.forEach((b) => {
    pendingByHotel.set(b.hotelId, (pendingByHotel.get(b.hotelId) ?? 0) + 1);
  });

  const rows: HotelRow[] = (hotels ?? []).map((h) => ({
    ...h,
    pendingCount: pendingByHotel.get(h.id) ?? 0,
  }));

  const columns: ColumnDef<HotelRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "Property",
      cell: ({ row }) => (
        <span className="flex items-center gap-2 font-medium text-text-primary">
          <HotelKindIcon kind={row.original.kind} />
          {row.original.name}
        </span>
      ),
    },
    { accessorKey: "city", header: "City" },
    {
      id: "fulfillment",
      header: "Booking mode",
      cell: ({ row }) => (
        <HotelFulfillmentBadge type={row.original.fulfillmentType} />
      ),
    },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row }) => <HotelOwnerBadge ownerType={row.original.ownerType} />,
    },
    {
      accessorKey: "avgRateUsd",
      header: "From",
      cell: ({ row }) => `$${row.original.avgRateUsd}/night`,
    },
    {
      id: "pending",
      header: "Pending",
      cell: ({ row }) =>
        row.original.pendingCount ? (
          <Badge variant="warning">{row.original.pendingCount}</Badge>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "neutral"}>
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Hotels & housing"
        description="Instant apartments, partner allotments, and on-request external properties."
        actions={
          <>
            {(pending?.length ?? 0) > 0 && (
              <Link href="/admin/hotels/confirmations">
                <Button size="sm" variant="secondary">
                  Confirmation queue ({pending?.length})
                </Button>
              </Link>
            )}
            {canEdit && (
              <Button size="sm" onClick={() => toast.info("Property onboarding — mock")}>
                Add property
              </Button>
            )}
          </>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        onRowClick={(row) => router.push(`/admin/hotels/${row.id}`)}
      />
    </>
  );
}
