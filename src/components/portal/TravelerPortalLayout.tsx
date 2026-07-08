"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PortalShell } from "@/components/portal/PortalShell";

export function TravelerPortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireRole="traveler">
      <PortalShell>{children}</PortalShell>
    </AuthGuard>
  );
}
