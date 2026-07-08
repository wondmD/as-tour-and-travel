"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  Badge,
  Button,
  DataTable,
  toast,
} from "@/components/ui";
import { useHotels } from "@/lib/hooks/use-travel-data";
import type { Hotel } from "@/lib/types";

export default function AdminHotelsPage() {
  const { data: hotels, isLoading } = useHotels();
  const canEdit = useRequireRole(["admin", "staff"]);

  const columns: ColumnDef<Hotel, unknown>[] = [
    {
      accessorKey: "name",
      header: "Property",
      cell: ({ row }) => (
        <span className="font-medium text-text-primary">{row.original.name}</span>
      ),
    },
    { accessorKey: "city", header: "City" },
    {
      accessorKey: "stars",
      header: "Stars",
      cell: ({ row }) => `${row.original.stars}★`,
    },
    {
      accessorKey: "partnerName",
      header: "Partner",
      cell: ({ row }) => row.original.partnerName ?? "—",
    },
    {
      accessorKey: "avgRateUsd",
      header: "Avg rate",
      cell: ({ row }) => `$${row.original.avgRateUsd}/night`,
    },
    {
      accessorKey: "roomTypes",
      header: "Room types",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "active"
              ? "success"
              : row.original.status === "pending"
                ? "warning"
                : "neutral"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Hotels"
        description="Partner properties, room inventory, and rate management."
        actions={
          canEdit && (
            <Button size="sm" onClick={() => toast.info("Hotel onboarding — mock")}>
              Add property
            </Button>
          )
        }
      />
      <DataTable columns={columns} data={hotels ?? []} loading={isLoading} />
    </>
  );
}
