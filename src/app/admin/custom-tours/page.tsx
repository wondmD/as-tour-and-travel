"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard";
import { CustomTourStatusBadge } from "@/components/tour/TourTypeBadge";
import { Badge, Button, DataTable } from "@/components/ui";
import { useAllCustomTourRequests } from "@/lib/hooks/use-custom-tour-data";
import type { CustomTourRequest } from "@/lib/types";
import { useRequireRole } from "@/components/auth/AuthGuard";

export default function AdminCustomToursPage() {
  const router = useRouter();
  const { data, isLoading } = useAllCustomTourRequests();
  const canEdit = useRequireRole(["admin", "staff"]);

  const pending = data?.filter((r) =>
    ["submitted", "under_review", "customized"].includes(r.status),
  ).length;

  const columns: ColumnDef<CustomTourRequest, unknown>[] = [
    { accessorKey: "reference", header: "Reference" },
    { accessorKey: "customerName", header: "Traveler" },
    {
      id: "destinations",
      header: "Destinations",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-xs">{row.original.destinationNames.join(", ")}</span>
      ),
    },
    { accessorKey: "travelerCount", header: "Pax" },
    {
      accessorKey: "budgetUsd",
      header: "Budget",
      cell: ({ row }) =>
        row.original.budgetUsd ? `$${row.original.budgetUsd}` : "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CustomTourStatusBadge status={row.original.status} />,
    },
    {
      id: "staff",
      header: "Assigned",
      cell: ({ row }) => row.original.assignedStaffName ?? "—",
    },
    {
      id: "flag",
      header: "",
      cell: ({ row }) =>
        row.original.createdByStaff ? (
          <Badge variant="accent">Staff-created</Badge>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Custom tours"
        description="Review traveler requests — confirm, reject, or send a customized proposal."
        actions={
          canEdit && (
            <>
              {pending ? (
                <Badge variant="warning">{pending} open</Badge>
              ) : null}
              <Link href="/admin/custom-tours/new">
                <Button size="sm">Create for traveler</Button>
              </Link>
            </>
          )
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        onRowClick={(row) => router.push(`/admin/custom-tours/${row.id}`)}
      />
    </>
  );
}
