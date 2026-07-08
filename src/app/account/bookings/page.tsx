"use client";

import Link from "next/link";
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
import { useMyBookings } from "@/lib/hooks/use-travel-data";
import type { Booking } from "@/lib/types";

const columns: ColumnDef<Booking, unknown>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">{row.original.reference}</span>
    ),
  },
  { accessorKey: "tourTitle", header: "Tour" },
  { accessorKey: "departureDate", header: "Departure" },
  {
    accessorKey: "travelerCount",
    header: "Travelers",
    cell: ({ row }) => <span className="tabular-nums">{row.original.travelerCount}</span>,
  },
  {
    accessorKey: "amountUsd",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums">${row.original.amountUsd.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as StatusKind} />,
  },
];

function BookingTable({ filter }: { filter?: (b: Booking) => boolean }) {
  const router = useRouter();
  const { data, isLoading } = useMyBookings();
  const rows = (data ?? []).filter(filter ?? (() => true));

  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={isLoading}
      onRowClick={(row) => router.push(`/account/bookings/${row.reference}`)}
      emptyTitle="No bookings in this category"
    />
  );
}

export default function MyBookingsPage() {
  return (
    <>
      <PageHeader
        title="My bookings"
        description="View, manage, and download documents for your reservations."
        actions={<Button href="/#tours" size="sm">Book a tour</Button>}
      />
      <Tabs
        items={[
          {
            value: "upcoming",
            label: "Upcoming",
            content: (
              <BookingTable
                filter={(b) => ["confirmed", "pending"].includes(b.status)}
              />
            ),
          },
          {
            value: "completed",
            label: "Completed",
            content: <BookingTable filter={(b) => b.status === "completed"} />,
          },
          {
            value: "all",
            label: "All",
            content: <BookingTable />,
          },
        ]}
      />
    </>
  );
}
