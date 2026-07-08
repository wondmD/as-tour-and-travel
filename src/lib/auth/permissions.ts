import type { UserRole } from "@/lib/types";

/** Admin sidebar section keys — used for role-based nav filtering. */
export type AdminSection =
  | "overview"
  | "bookings"
  | "payments"
  | "tours"
  | "hotels"
  | "transport"
  | "tickets"
  | "destinations"
  | "promotions"
  | "reviews"
  | "blog"
  | "reports"
  | "customers"
  | "support"
  | "users"
  | "settings"
  | "partner_inventory";

const ROLE_SECTIONS: Record<UserRole, AdminSection[] | "*"> = {
  admin: "*",
  staff: [
    "overview",
    "bookings",
    "payments",
    "tours",
    "customers",
    "support",
  ],
  support_agent: ["overview", "bookings", "customers", "support"],
  content_manager: [
    "overview",
    "destinations",
    "blog",
    "reviews",
    "tours",
  ],
  partner: ["overview", "partner_inventory", "bookings"],
  traveler: [],
};

export function canAccessAdminSection(
  role: UserRole,
  section: AdminSection,
): boolean {
  const allowed = ROLE_SECTIONS[role];
  if (allowed === "*") return true;
  return allowed.includes(section);
}

export function roleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "Administrator",
    staff: "Staff",
    support_agent: "Support Agent",
    content_manager: "Content Manager",
    partner: "Partner",
    traveler: "Traveler",
  };
  return labels[role];
}

export function isStaffRole(role: UserRole): boolean {
  return role !== "traveler";
}

export function adminHomeForRole(role: UserRole): string {
  if (role === "partner") return "/admin/partner";
  if (role === "support_agent") return "/admin/support";
  if (role === "content_manager") return "/admin/destinations";
  return "/admin";
}
