"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { CustomTourStatusBadge } from "@/components/tour/TourTypeBadge";
import { Button, DataTable } from "@/components/ui";
import { useMyCustomTourRequests } from "@/lib/hooks/use-custom-tour-data";
import type { CustomTourRequest } from "@/lib/types";

export default function AccountCustomToursPage() {
  const router = useRouter();
  const { data, isLoading } = useMyCustomTourRequests();

  const columns: ColumnDef<CustomTourRequest, unknown>[] = [
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">{row.original.reference}</span>
      ),
    },
    {
      id: "destinations",
      header: "Destinations",
      cell: ({ row }) => row.original.destinationNames.join(", "),
    },
    {
      accessorKey: "travelerCount",
      header: "Travelers",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CustomTourStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <>
      <PageHeader
        title="Custom tour requests"
        description="Track requests, proposals, and confirmations for personalized itineraries."
        actions={
          <Link href="/tours/request">
            <Button size="sm">New request</Button>
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        onRowClick={(row) => router.push(`/account/custom-tours/${row.reference}`)}
      />
    </>
  );
}
