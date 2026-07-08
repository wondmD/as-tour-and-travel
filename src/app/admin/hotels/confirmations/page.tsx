"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import { HotelBookingStatusBadge } from "@/components/hotel/HotelBadges";
import {
  Button,
  DataTable,
  toast,
} from "@/components/ui";
import {
  useConfirmHotelBooking,
  useDeclineHotelBooking,
  usePendingHotelBookings,
} from "@/lib/hooks/use-hotel-data";
import type { HotelBooking } from "@/lib/types";

export default function AdminHotelConfirmationsPage() {
  const { data: pending, isLoading } = usePendingHotelBookings();
  const confirm = useConfirmHotelBooking();
  const decline = useDeclineHotelBooking();
  const canOps = useRequireRole(["admin", "staff"]);

  const columns: ColumnDef<HotelBooking, unknown>[] = [
    { accessorKey: "reference", header: "Reference" },
    { accessorKey: "customerName", header: "Guest" },
    { accessorKey: "hotelName", header: "Property" },
    { accessorKey: "roomTypeName", header: "Room" },
    {
      id: "stay",
      header: "Dates",
      cell: ({ row }) =>
        `${row.original.checkIn} → ${row.original.checkOut}`,
    },
    {
      accessorKey: "amountUsd",
      header: "Total",
      cell: ({ row }) => `$${row.original.amountUsd}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <HotelBookingStatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        canOps ? (
          <span className="flex gap-1">
            <button
              type="button"
              className="rounded-lg bg-success/10 px-2 py-1 text-xs font-semibold text-success"
              disabled={confirm.isPending}
              onClick={async (e) => {
                e.stopPropagation();
                await confirm.mutateAsync(row.original.id);
                toast.success("Booking confirmed — guest notified");
              }}
            >
              Confirm
            </button>
            <button
              type="button"
              className="rounded-lg bg-danger/10 px-2 py-1 text-xs font-semibold text-danger"
              disabled={decline.isPending}
              onClick={async (e) => {
                e.stopPropagation();
                await decline.mutateAsync({
                  id: row.original.id,
                  reason: "Property fully booked for requested dates.",
                });
                toast.info("Booking declined — refund initiated");
              }}
            >
              Decline
            </button>
          </span>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Hotel confirmation queue"
        description="On-request bookings awaiting staff verification with external properties."
      />
      <DataTable columns={columns} data={pending ?? []} loading={isLoading} />
    </>
  );
}
