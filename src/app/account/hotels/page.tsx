"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard";
import { HotelBookingStatusBadge } from "@/components/hotel/HotelBadges";
import {
  Button,
  DataTable,
} from "@/components/ui";
import { useMyHotelBookings } from "@/lib/hooks/use-hotel-data";

interface HotelBookingRow {
  reference: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  amountUsd: number;
  status: string;
  nights: number;
}

export default function AccountHotelsPage() {
  const router = useRouter();
  const { data, isLoading } = useMyHotelBookings();

  const columns: ColumnDef<HotelBookingRow, unknown>[] = [
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">{row.original.reference}</span>
      ),
    },
    { accessorKey: "hotelName", header: "Property" },
    {
      id: "dates",
      header: "Stay",
      cell: ({ row }) =>
        `${row.original.checkIn} → ${row.original.checkOut} (${row.original.nights}n)`,
    },
    {
      accessorKey: "amountUsd",
      header: "Total",
      cell: ({ row }) => `$${row.original.amountUsd.toLocaleString()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <HotelBookingStatusBadge status={row.original.status} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Hotel stays"
        description="Add-on and standalone accommodation — instant and on-request bookings."
        actions={
          <Link href="/hotels">
            <Button size="sm">Find a stay</Button>
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={(data ?? []) as HotelBookingRow[]}
        loading={isLoading}
        onRowClick={(row) => router.push(`/account/hotels/${row.reference}`)}
      />
    </>
  );
}
