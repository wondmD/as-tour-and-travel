"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { Avatar, Badge, DataTable } from "@/components/ui";
import { useCustomers } from "@/lib/hooks/use-travel-data";
import { mockDb } from "@/lib/mock/db";
import type { User } from "@/lib/types";

export default function AdminCustomersPage() {
  const { data, isLoading } = useCustomers();

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: "fullName",
      header: "Customer",
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <Avatar name={row.original.fullName} size="xs" />
          {row.original.fullName}
        </span>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "bookings",
      header: "Bookings",
      cell: ({ row }) =>
        mockDb.bookings.filter((b) => b.userId === row.original.id).length,
    },
    {
      accessorKey: "emailVerified",
      header: "Verified",
      cell: ({ row }) => (
        <Badge variant={row.original.emailVerified ? "success" : "warning"}>
          {row.original.emailVerified ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        description="Registered travelers and booking history."
      />
      <DataTable columns={columns} data={data ?? []} loading={isLoading} />
    </>
  );
}
