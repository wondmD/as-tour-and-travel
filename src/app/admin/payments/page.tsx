"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { Badge, DataTable, toast, Button } from "@/components/ui";
import { usePayments } from "@/lib/hooks/use-travel-data";
import type { Payment } from "@/lib/types";
import { useRequireRole } from "@/components/auth/AuthGuard";

export default function AdminPaymentsPage() {
  const { data, isLoading } = usePayments();
  const canReconcile = useRequireRole(["admin", "staff"]);

  const columns: ColumnDef<Payment, unknown>[] = [
    { accessorKey: "bookingReference", header: "Booking" },
    { accessorKey: "customerName", header: "Customer" },
    {
      accessorKey: "amountUsd",
      header: "Amount",
      cell: ({ row }) => `$${row.original.amountUsd.toLocaleString()}`,
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => <Badge variant="outline">{row.original.method}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "successful" ? "success" : "warning"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];

  return (
    <>
      <PageHeader
        title="Payments"
        description="Transactions, reconciliation, and refunds."
        actions={
          canReconcile && (
            <Button size="sm" variant="secondary" onClick={() => toast.info("Reconcile — mock")}>
              Reconcile
            </Button>
          )
        }
      />
      <DataTable columns={columns} data={data ?? []} loading={isLoading} />
    </>
  );
}
