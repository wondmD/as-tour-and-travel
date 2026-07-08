"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@/lib/types";
import { useSession } from "@/lib/stores/auth";
import { isStaffRole } from "@/lib/auth/permissions";

/** Redirect unauthenticated users to login. */
export function AuthGuard({
  children,
  requireRole,
}: {
  children: ReactNode;
  requireRole?: "traveler" | "staff";
}) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/auth/login");
      return;
    }
    if (requireRole === "traveler" && session.user.role !== "traveler") {
      router.replace("/admin");
    }
    if (requireRole === "staff" && !isStaffRole(session.user.role)) {
      router.replace("/account");
    }
  }, [session, requireRole, router]);

  if (!session) return null;
  if (requireRole === "traveler" && session.user.role !== "traveler") return null;
  if (requireRole === "staff" && !isStaffRole(session.user.role)) return null;

  return children;
}

export function useRequireRole(roles: UserRole[]) {
  const session = useSession();
  return session ? roles.includes(session.user.role) : false;
}
