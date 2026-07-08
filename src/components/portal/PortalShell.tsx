"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  Compass,
  Heart,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  User,
} from "lucide-react";
import { type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import {
  DashboardShell,
  Topbar,
  type NavGroup,
} from "@/components/dashboard";
import { DemoRoleSwitcher } from "@/components/auth/DemoRoleSwitcher";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { toast } from "@/components/ui/Toaster";
import { useNotifications } from "@/lib/hooks/use-travel-data";
import { useAuthStore, useSession } from "@/lib/stores/auth";

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Overview", href: "/account", icon: LayoutDashboard, matchNested: false },
      { label: "My bookings", href: "/account/bookings", icon: CalendarCheck, badge: 2 },
      { label: "My trips", href: "/account/trips", icon: Map },
      { label: "Wishlist", href: "/account/wishlist", icon: Heart },
      { label: "Travel journal", href: "/account/journal", icon: BookOpen },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/account/profile", icon: User },
      { label: "Saved travelers", href: "/account/travelers", icon: Compass },
      { label: "Notifications", href: "/account/notifications", icon: Bell, badge: 1 },
      { label: "Security", href: "/account/security", icon: Settings },
    ],
  },
];

const CRUMB_LABELS: Record<string, string> = {
  account: "My account",
  bookings: "Bookings",
  trips: "Trips",
  wishlist: "Wishlist",
  journal: "Journal",
  profile: "Profile",
  travelers: "Saved travelers",
  notifications: "Notifications",
  security: "Security",
};

function useCrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, index) => ({
    label: CRUMB_LABELS[part] ?? part.toUpperCase(),
    href: index < parts.length - 1 ? `/${parts.slice(0, index + 1).join("/")}` : undefined,
  }));
}

export function PortalShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const crumbs = useCrumbs();
  const { data: notifications } = useNotifications();
  const unread = notifications?.filter((n) => !n.read).length ?? 0;
  const user = session?.user;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/auth/login");
  };

  return (
    <DashboardShell
      theme="light"
      groups={NAV_GROUPS}
      brand={<Logo variant="compact" theme="dark" />}
      sidebarFooter={
        <div className="space-y-3">
          <DemoRoleSwitcher compact />
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            className="justify-start text-text-secondary hover:text-primary"
            onClick={handleLogout}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      }
      topbar={
        <Topbar
          breadcrumbs={crumbs}
          notificationCount={unread}
          onNotificationsClick={() => router.push("/account/notifications")}
          actions={
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  aria-label="Account menu"
                  className="rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Avatar name={user?.fullName ?? "Traveler"} size="sm" />
                </button>
              }
              items={[
                { type: "label", label: user?.fullName ?? "Traveler" },
                { label: "Profile", icon: User, onSelect: () => router.push("/account/profile") },
                { label: "Security", icon: Settings, onSelect: () => router.push("/account/security") },
                { type: "separator" },
                { label: "Sign out", icon: LogOut, destructive: true, onSelect: handleLogout },
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

/** Centered auth card wrapper for login/register flows. */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mesh-blobs mesh-blobs-accent pattern-dots relative flex min-h-dvh flex-col lg:flex-row">
      <aside className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 lg:flex">
        <Link href="/">
          <Logo theme="dark" />
        </Link>
        <div className="relative z-10 max-w-md">
          <p className="pill-badge mb-4 w-fit">Ethiopia awaits</p>
          <h1 className="font-heading text-3xl font-bold leading-tight text-text-primary xl:text-4xl">
            Your journey starts with one account.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Book tours, manage travelers, save wishlists, and access your
            itinerary — all in one elegant traveler portal.
          </p>
        </div>
        <DemoRoleSwitcher />
      </aside>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <Logo theme="dark" />
            </Link>
          </div>
          <div className="glass-card static p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
            )}
            <div className="mt-6">{children}</div>
            {footer && (
              <div className="mt-6 border-t border-border/50 pt-5 text-center text-sm text-text-secondary">
                {footer}
              </div>
            )}
          </div>
          <div className="mt-4 lg:hidden">
            <DemoRoleSwitcher />
          </div>
        </div>
      </main>
    </div>
  );
}
