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
import { useAttractionTickets } from "@/lib/hooks/use-travel-data";
import type { AttractionTicket } from "@/lib/types";

export default function AdminTicketsPage() {
  const { data: tickets, isLoading } = useAttractionTickets();
  const canEdit = useRequireRole(["admin", "staff"]);

  const columns: ColumnDef<AttractionTicket, unknown>[] = [
    {
      accessorKey: "name",
      header: "Ticket",
      cell: ({ row }) => (
        <span className="font-medium text-text-primary">{row.original.name}</span>
      ),
    },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category}</span>
      ),
    },
    {
      accessorKey: "priceUsd",
      header: "Price",
      cell: ({ row }) => `$${row.original.priceUsd}`,
    },
    {
      accessorKey: "validDays",
      header: "Valid",
      cell: ({ row }) =>
        row.original.validDays === 1
          ? "1 day"
          : `${row.original.validDays} days`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "active"
              ? "success"
              : row.original.status === "sold_out"
                ? "warning"
                : "neutral"
          }
        >
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Attraction tickets"
        description="Museum passes, park entries, and event tickets bundled with tours."
        actions={
          canEdit && (
            <Button size="sm" onClick={() => toast.info("Ticket catalog — mock")}>
              Add ticket
            </Button>
          )
        }
      />
      <DataTable columns={columns} data={tickets ?? []} loading={isLoading} />
    </>
  );
}
