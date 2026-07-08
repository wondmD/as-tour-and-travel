"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard";
import {
  AssistanceBadge,
  TransportBookingStatusBadge,
  TransportTypeBadge,
} from "@/components/transport/TransportBadges";
import { Button, DataTable } from "@/components/ui";
import { useMyTransportBookings } from "@/lib/hooks/use-transport-data";

import type { TransportBookingStatus } from "@/lib/types";

interface TransportRow {
  reference: string;
  origin: string;
  destination: string;
  travelDate: string;
  amountUsd: number;
  status: TransportBookingStatus;
  routeType: "flight" | "bus" | "private_car";
  coordinatedByCompany: boolean;
}

export default function AccountTransportPage() {
  const router = useRouter();
  const { data, isLoading } = useMyTransportBookings();

  const columns: ColumnDef<TransportRow, unknown>[] = [
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">{row.original.reference}</span>
      ),
    },
    {
      id: "route",
      header: "Route",
      cell: ({ row }) => `${row.original.origin} → ${row.original.destination}`,
    },
    {
      accessorKey: "travelDate",
      header: "Travel date",
    },
    {
      accessorKey: "amountUsd",
      header: "Total",
      cell: ({ row }) => `$${row.original.amountUsd.toLocaleString()}`,
    },
    {
      accessorKey: "routeType",
      header: "Mode",
      cell: ({ row }) => <TransportTypeBadge type={row.original.routeType} />,
    },
    {
      id: "assistance",
      header: "Assistance",
      cell: ({ row }) =>
        row.original.coordinatedByCompany ? (
          <AssistanceBadge coordinated />
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <TransportBookingStatusBadge status={row.original.status} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Travel transfers"
        description="Flights, coaches, and private transfers — coordinated by AS Tour so you move effortlessly."
        actions={
          <Link href="/transport">
            <Button size="sm">Book a transfer</Button>
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={(data ?? []) as TransportRow[]}
        loading={isLoading}
        onRowClick={(row) => router.push(`/account/transport/${row.reference}`)}
      />
    </>
  );
}
