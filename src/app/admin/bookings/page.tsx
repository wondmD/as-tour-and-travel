"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import {
  Avatar,
  Button,
  DataTable,
  StatusBadge,
  Tabs,
  type StatusKind,
} from "@/components/ui";
import {
  useAllBookings,
  useConfirmBooking,
} from "@/lib/hooks/use-travel-data";
import { ALL_TRAVELERS } from "@/lib/mock/seed";
import type { Booking } from "@/lib/types";
import { useRequireRole } from "@/components/auth/AuthGuard";
import { toast } from "@/components/ui/Toaster";

const columns: ColumnDef<Booking, unknown>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">{row.original.reference}</span>
    ),
  },
  {
    accessorKey: "userId",
    header: "Customer",
    cell: ({ row }) => {
      const customer = ALL_TRAVELERS.find((u) => u.id === row.original.userId);
      return (
        <span className="flex items-center gap-2">
          <Avatar name={customer?.fullName ?? "?"} size="xs" />
          {customer?.fullName ?? row.original.userId}
        </span>
      );
    },
  },
  { accessorKey: "tourTitle", header: "Tour" },
  { accessorKey: "departureDate", header: "Departure" },
  {
    accessorKey: "amountUsd",
    header: "Amount",
    cell: ({ row }) => `$${row.original.amountUsd.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as StatusKind} />,
  },
];

export default function AdminBookingsPage() {
  const router = useRouter();
  const { data, isLoading } = useAllBookings();
  const confirm = useConfirmBooking();
  const canConfirm = useRequireRole(["admin", "staff"]);

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Confirm, modify, cancel, and monitor all reservations."
        actions={
          canConfirm && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toast.info("Export — mock")}
            >
              Export
            </Button>
          )
        }
      />
      <Tabs
        appearance="underline"
        items={[
          {
            value: "pending",
            label: "Pending",
            content: (
              <DataTable
                columns={columns}
                data={(data ?? []).filter((b) => b.status === "pending")}
                loading={isLoading}
                onRowClick={(row) => router.push(`/admin/bookings/${row.reference}`)}
              />
            ),
          },
          {
            value: "confirmed",
            label: "Confirmed",
            content: (
              <DataTable
                columns={columns}
                data={(data ?? []).filter((b) => b.status === "confirmed")}
                loading={isLoading}
                onRowClick={(row) => router.push(`/admin/bookings/${row.reference}`)}
              />
            ),
          },
          {
            value: "all",
            label: "All",
            content: (
              <DataTable
                columns={columns}
                data={data ?? []}
                loading={isLoading}
                onRowClick={(row) => router.push(`/admin/bookings/${row.reference}`)}
              />
            ),
          },
        ]}
      />
    </>
  );
}
