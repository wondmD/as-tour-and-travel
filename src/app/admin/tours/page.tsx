"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  DataTable,
  Progress,
  toast,
} from "@/components/ui";
import { useTours, useUpdateTourStatus } from "@/lib/hooks/use-travel-data";
import { mockDb } from "@/lib/mock/db";
import type { TourProduct } from "@/lib/types";
import { useRequireRole } from "@/components/auth/AuthGuard";

export default function AdminToursPage() {
  const { data: tours, isLoading } = useTours();
  const updateStatus = useUpdateTourStatus();
  const canEdit = useRequireRole(["admin", "staff", "content_manager"]);

  const columns: ColumnDef<TourProduct, unknown>[] = [
    {
      accessorKey: "title",
      header: "Tour",
      cell: ({ row }) => (
        <span className="font-medium text-text-primary">{row.original.title}</span>
      ),
    },
    { accessorKey: "destination", header: "Destination" },
    { accessorKey: "durationDays", header: "Days" },
    {
      accessorKey: "basePriceUsd",
      header: "From",
      cell: ({ row }) => `$${row.original.basePriceUsd}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "published" ? "success" : "neutral"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "capacity",
      header: "Next departure fill",
      cell: ({ row }) => {
        const dep = mockDb.departures.find((d) => d.tourId === row.original.id);
        if (!dep) return "—";
        const pct = Math.round((dep.seatsSold / dep.capacity) * 100);
        return (
          <div className="min-w-28">
            <Progress value={dep.seatsSold} max={dep.capacity} tone={pct >= 85 ? "warning" : "primary"} />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        canEdit ? (
          <button
            type="button"
            className="rounded-lg bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/14"
            onClick={(e) => {
              e.stopPropagation();
              const next =
                row.original.status === "published" ? "draft" : "published";
              updateStatus.mutate({ id: row.original.id, status: next });
              toast.success(`Tour ${next}`);
            }}
          >
            {row.original.status === "published" ? "Unpublish" : "Publish"}
          </button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Tours"
        description="Manage packages, departures, pricing, and availability."
        actions={
          canEdit && (
            <Button size="sm" onClick={() => toast.info("Tour builder — mock")}>
              New tour
            </Button>
          )
        }
      />
      <DataTable columns={columns} data={tours ?? []} loading={isLoading} />
    </>
  );
}
