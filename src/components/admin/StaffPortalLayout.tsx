"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminShell } from "@/components/admin/AdminShell";

export function StaffPortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireRole="staff">
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
