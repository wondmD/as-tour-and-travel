"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BedDouble,
  Bell,
  BookOpen,
  Bus,
  CalendarCheck,
  Compass,
  CreditCard,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Map,
  Megaphone,
  Newspaper,
  Plane,
  Settings,
  Star,
  Ticket,
  User,
  Users,
  Wand2,
} from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { Logo } from "@/components/brand/Logo";
import {
  DashboardShell,
  Topbar,
  type NavGroup,
  type NavItem,
} from "@/components/dashboard";
import { DemoRoleSwitcher } from "@/components/auth/DemoRoleSwitcher";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { toast } from "@/components/ui/Toaster";
import {
  adminHomeForRole,
  canAccessAdminSection,
  roleLabel,
  type AdminSection,
} from "@/lib/auth/permissions";
import { useAuthStore, useSession } from "@/lib/stores/auth";
import { useRouter } from "next/navigation";

const ALL_NAV: (NavItem & { section: AdminSection })[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, matchNested: false, section: "overview" },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck, badge: 6, section: "bookings" },
  { label: "Payments", href: "/admin/payments", icon: CreditCard, section: "payments" },
  { label: "Tours", href: "/admin/tours", icon: Compass, section: "tours" },
  { label: "Custom tours", href: "/admin/custom-tours", icon: Wand2, badge: 2, section: "custom_tours" },
  { label: "Travel bookings", href: "/admin/travel", icon: Plane, badge: 1, section: "travel_bookings" },
  { label: "Hotels", href: "/admin/hotels", icon: BedDouble, section: "hotels" },
  { label: "Transport", href: "/admin/transport", icon: Bus, section: "transport" },
  { label: "Tickets", href: "/admin/tickets", icon: Ticket, section: "tickets" },
  { label: "Destinations", href: "/admin/destinations", icon: Map, section: "destinations" },
  { label: "Promotions", href: "/admin/promotions", icon: Megaphone, section: "promotions" },
  { label: "Reviews", href: "/admin/reviews", icon: Star, badge: 3, section: "reviews" },
  { label: "Blog", href: "/admin/blog", icon: Newspaper, section: "blog" },
  { label: "Reports", href: "/admin/reports", icon: BarChart3, section: "reports" },
  { label: "Customers", href: "/admin/customers", icon: Users, section: "customers" },
  { label: "Support", href: "/admin/support", icon: LifeBuoy, badge: 2, section: "support" },
  { label: "Users & roles", href: "/admin/users", icon: User, section: "users" },
  { label: "Partner inventory", href: "/admin/partner", icon: BedDouble, section: "partner_inventory" },
  { label: "Settings", href: "/admin/settings", icon: Settings, section: "settings" },
];

const NAV_GROUPS_META = [
  { label: undefined, sections: ["overview", "bookings", "payments"] as AdminSection[] },
  { label: "Catalog", sections: ["tours", "custom_tours", "travel_bookings", "hotels", "transport", "tickets", "destinations", "partner_inventory"] as AdminSection[] },
  { label: "Growth", sections: ["promotions", "reviews", "blog", "reports"] as AdminSection[] },
  { label: "Operations", sections: ["customers", "support", "users", "settings"] as AdminSection[] },
];

const CRUMB_LABELS: Record<string, string> = {
  admin: "Admin",
  bookings: "Bookings",
  payments: "Payments",
  tours: "Tours",
  "custom-tours": "Custom tours",
  travel: "Travel bookings",
  hotels: "Hotels",
  transport: "Transport",
  tickets: "Tickets",
  destinations: "Destinations",
  promotions: "Promotions",
  reviews: "Reviews",
  blog: "Blog",
  reports: "Reports",
  customers: "Customers",
  support: "Support",
  users: "Users",
  partner: "Partner",
  settings: "Settings",
  confirmations: "Confirmations",
  design: "Design route",
  new: "New tour",
};

function useCrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, index) => ({
    label: CRUMB_LABELS[part] ?? part.toUpperCase(),
    href: index < parts.length - 1 ? `/${parts.slice(0, index + 1).join("/")}` : undefined,
  }));
}

function useAdminNav(): NavGroup[] {
  const session = useSession();
  const role = session?.user.role ?? "staff";

  return useMemo(() => {
    return NAV_GROUPS_META.map((group) => ({
      label: group.label,
      items: ALL_NAV.filter(
        (item) =>
          group.sections.includes(item.section) &&
          canAccessAdminSection(role, item.section),
      ).map(({ section: _s, ...item }) => item),
    })).filter((g) => g.items.length > 0);
  }, [role]);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const crumbs = useCrumbs();
  const groups = useAdminNav();
  const user = session?.user;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/auth/login");
  };

  return (
    <DashboardShell
      groups={groups}
      brand={<Logo variant="compact" theme="light" />}
      sidebarFooter={
        <div className="space-y-3">
          <DemoRoleSwitcher />
          {user && (
            <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
              <Avatar name={user.fullName} size="sm" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-xs font-semibold text-white">
                  {user.fullName}
                </p>
                <p className="truncate text-[11px] text-[var(--sidebar-fg)]/70">
                  {roleLabel(user.role)}
                  {user.partnerName ? ` · ${user.partnerName}` : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      }
      topbar={
        <Topbar
          breadcrumbs={crumbs}
          onSearchClick={() => toast.info("Global search — mock")}
          notificationCount={4}
          onNotificationsClick={() => toast.info("Staff notifications — mock")}
          actions={
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  aria-label="Account menu"
                  className="rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Avatar name={user?.fullName ?? "User"} size="sm" />
                </button>
              }
              items={[
                { type: "label", label: user?.fullName ?? "User" },
                {
                  label: "Traveler portal",
                  icon: User,
                  onSelect: () => router.push("/account"),
                },
                {
                  label: "Settings",
                  icon: Settings,
                  onSelect: () => router.push("/admin/settings"),
                },
                { type: "separator" },
                {
                  label: "Sign out",
                  icon: LogOut,
                  destructive: true,
                  onSelect: handleLogout,
                },
              ]}
            />
          }
        />
      }
    >
      {children}
    </DashboardShell>
  );
}

export { adminHomeForRole };
