"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { Badge, Button, DataTable } from "@/components/ui";
import { useSupportTickets } from "@/lib/hooks/use-travel-data";
import type { SupportTicket } from "@/lib/types";

const statusVariant: Record<string, "success" | "warning" | "primary" | "neutral"> = {
  open: "warning",
  in_progress: "primary",
  waiting_customer: "neutral",
  resolved: "success",
  closed: "neutral",
};

export default function AdminSupportPage() {
  const router = useRouter();
  const { data, isLoading } = useSupportTickets();

  const columns: ColumnDef<SupportTicket, unknown>[] = [
    {
      accessorKey: "reference",
      header: "Ticket",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">{row.original.reference}</span>
      ),
    },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "subject", header: "Subject" },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge variant={row.original.priority === "high" ? "danger" : "neutral"}>
          {row.original.priority}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status] ?? "neutral"}>
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "assigneeName",
      header: "Assignee",
      cell: ({ row }) => row.original.assigneeName ?? "Unassigned",
    },
  ];

  return (
    <>
      <PageHeader
        title="Support"
        description="Tickets, live chat handoffs, and customer inquiries."
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
      />
    </>
  );
}
