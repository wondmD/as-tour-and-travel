"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { Avatar, Badge, DataTable } from "@/components/ui";
import { DEMO_USERS } from "@/lib/mock/seed";
import { roleLabel } from "@/lib/auth/permissions";
import type { User } from "@/lib/types";
import { useRequireRole } from "@/components/auth/AuthGuard";

export default function AdminUsersPage() {
  const isAdmin = useRequireRole(["admin"]);

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: "fullName",
      header: "User",
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <Avatar name={row.original.fullName} size="xs" />
          {row.original.fullName}
        </span>
      ),
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="primary">{roleLabel(row.original.role)}</Badge>,
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
  ];

  if (!isAdmin) {
    return (
      <PageHeader
        title="Access restricted"
        description="Only administrators can manage users and roles."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Users & roles"
        description="Staff accounts, role assignment, and access control."
      />
      <DataTable columns={columns} data={DEMO_USERS} />
    </>
  );
}
