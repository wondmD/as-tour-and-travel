"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Bus, Car, Plane } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  Badge,
  Button,
  DataTable,
  toast,
} from "@/components/ui";
import { useTransportRoutes } from "@/lib/hooks/use-travel-data";
import type { TransportRoute } from "@/lib/types";

const TYPE_ICON = {
  flight: Plane,
  bus: Bus,
  private_car: Car,
} as const;

export default function AdminTransportPage() {
  const { data: routes, isLoading } = useTransportRoutes();
  const canEdit = useRequireRole(["admin", "staff"]);

  const columns: ColumnDef<TransportRoute, unknown>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const Icon = TYPE_ICON[row.original.type];
        return (
          <span className="flex items-center gap-2 capitalize">
            <Icon className="size-4 text-primary" />
            {row.original.type.replace("_", " ")}
          </span>
        );
      },
    },
    { accessorKey: "origin", header: "Origin" },
    { accessorKey: "destination", header: "Destination" },
    { accessorKey: "operator", header: "Operator" },
    {
      id: "assistance",
      header: "Assistance",
      cell: ({ row }) =>
        row.original.assistanceIncluded ? (
          <Badge variant="success">Coordinated</Badge>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "durationMinutes",
      header: "Duration",
      cell: ({ row }) => {
        const h = Math.floor(row.original.durationMinutes / 60);
        const m = row.original.durationMinutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
      },
    },
    {
      accessorKey: "priceFromUsd",
      header: "From",
      cell: ({ row }) => `$${row.original.priceFromUsd}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "active"
              ? "success"
              : row.original.status === "seasonal"
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
        title="Transport"
        description="Flights, coaches, and private transfers — AS Tour helps travelers move effortlessly."
        actions={
          canEdit && (
            <>
              <Link href="/admin/transport/confirmations">
                <Button variant="soft" size="sm">
                  Confirmations
                </Button>
              </Link>
              <Button size="sm" onClick={() => toast.info("Route builder — mock")}>
                Add route
              </Button>
            </>
          )
        }
      />
      <DataTable columns={columns} data={routes ?? []} loading={isLoading} />
    </>
  );
}
