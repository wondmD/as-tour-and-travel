"use client";

import { Bell, Menu, Search } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/lib/stores/ui";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

interface TopbarProps {
  /** Breadcrumb trail for the current page. */
  breadcrumbs?: Crumb[];
  /** Right-side cluster: user menu, language switcher, … */
  actions?: ReactNode;
  /** Show the search affordance (visual only until search ships). */
  onSearchClick?: () => void;
  /** Unread notifications count for the bell. */
  notificationCount?: number;
  onNotificationsClick?: () => void;
}

export function Topbar({
  breadcrumbs,
  actions,
  onSearchClick,
  notificationCount = 0,
  onNotificationsClick,
}: TopbarProps) {
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-border/60 px-4 sm:px-6",
        "glass-strong",
      )}
    >
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open navigation"
        className="flex size-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-primary/6 hover:text-primary lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="hidden sm:block" />
      )}

      <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
        {onSearchClick && (
          <button
            type="button"
            onClick={onSearchClick}
            className={cn(
              "hidden min-w-52 items-center gap-2.5 rounded-xl border border-border/70 bg-white/55 px-3.5 py-2 text-sm text-text-secondary/70 transition-colors md:flex",
              "hover:border-primary/30 hover:text-text-secondary",
            )}
          >
            <Search className="size-4" />
            <span className="flex-1 text-start">Search…</span>
            <kbd className="rounded-md border border-border/80 bg-surface px-1.5 py-0.5 font-sans text-[10px] font-semibold text-text-secondary/70">
              ⌘K
            </kbd>
          </button>
        )}

        {onNotificationsClick && (
          <button
            type="button"
            onClick={onNotificationsClick}
            aria-label={`Notifications${notificationCount ? ` (${notificationCount} unread)` : ""}`}
            className="relative flex size-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-primary/6 hover:text-primary"
          >
            <Bell className="size-5" strokeWidth={1.9} />
            {notificationCount > 0 && (
              <span className="absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-surface">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
        )}

        {actions}
      </div>
    </header>
  );
}
