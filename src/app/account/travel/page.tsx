"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { TravelPlanStatusBadge } from "@/components/travel/TravelDesignerParts";
import { TRAVEL_KIND_LABELS, routeSummary } from "@/lib/travel-plan";
import { Button, DataTable } from "@/components/ui";
import { useMyTravelPlans } from "@/lib/hooks/use-travel-plan-data";
import type { TravelPlan, TravelPlanKind } from "@/lib/types";

type Row = TravelPlan;

export default function AccountTravelPage() {
  const router = useRouter();
  const { data, isLoading } = useMyTravelPlans();

  const columns: ColumnDef<Row, unknown>[] = [
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">{row.original.reference}</span>
      ),
    },
    { accessorKey: "name", header: "Trip" },
    {
      accessorKey: "kind",
      header: "Type",
      cell: ({ row }) => TRAVEL_KIND_LABELS[row.original.kind as TravelPlanKind],
    },
    {
      id: "route",
      header: "Route",
      cell: ({ row }) => routeSummary(row.original.stops),
    },
    {
      id: "dates",
      header: "Dates",
      cell: ({ row }) =>
        row.original.endDate
          ? `${row.original.startDate} → ${row.original.endDate}`
          : row.original.startDate,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <TravelPlanStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "quotedUsd",
      header: "Quote",
      cell: ({ row }) =>
        row.original.quotedUsd ? `$${row.original.quotedUsd.toLocaleString()}` : "—",
    },
  ];

  return (
    <>
      <PageHeader
        title="My travel plans"
        description="International and domestic journeys — simpler than a tour, with AS Tour coordination."
        actions={
          <Link href="/travel/design">
            <Button size="sm">
              <Plus className="size-4" />
              Design travel
            </Button>
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        onRowClick={(row) => router.push(`/account/travel/${row.reference}`)}
      />
    </>
  );
}
