"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { TravelPlanStatusBadge } from "@/components/travel/TravelDesignerParts";
import { TRAVEL_KIND_LABELS, routeSummary } from "@/lib/travel-plan";
import { Badge, DataTable } from "@/components/ui";
import { useAllTravelPlans } from "@/lib/hooks/use-travel-plan-data";
import type { TravelPlan, TravelPlanKind } from "@/lib/types";

export default function AdminTravelPage() {
  const router = useRouter();
  const { data, isLoading } = useAllTravelPlans();

  const pending = data?.filter((p) => p.status === "submitted").length ?? 0;

  const columns: ColumnDef<TravelPlan, unknown>[] = [
    { accessorKey: "reference", header: "Ref" },
    { accessorKey: "customerName", header: "Traveler" },
    { accessorKey: "name", header: "Trip" },
    {
      accessorKey: "kind",
      header: "Type",
      cell: ({ row }) => TRAVEL_KIND_LABELS[row.original.kind as TravelPlanKind],
    },
    {
      id: "route",
      header: "Route",
      cell: ({ row }) => (
        <span className="max-w-[12rem] truncate">{routeSummary(row.original.stops)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <TravelPlanStatusBadge status={row.original.status} />,
    },
    {
      id: "assistance",
      header: "Assistance",
      cell: ({ row }) =>
        row.original.assistanceRequested ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Travel bookings"
        description="International and domestic travel plans — review routes and send quotes."
        toolbar={
          pending > 0 ? (
            <Badge variant="warning">{pending} awaiting quote</Badge>
          ) : undefined
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        onRowClick={(row) => router.push(`/admin/travel/${row.id}`)}
      />
    </>
  );
}
