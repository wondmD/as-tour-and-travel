"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/lib/stores/ui";
import { Tooltip } from "@/components/ui/Tooltip";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Small counter (e.g. pending bookings). */
  badge?: number;
  /** Match nested routes as active (default true). */
  matchNested?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

interface SidebarProps {
  groups: NavGroup[];
  /** Brand block at the top (logo + name). */
  brand: ReactNode;
  /** Pinned block at the bottom (user card, logout, …). */
  footer?: ReactNode;
  /** `dark` for admin ops; `light` for the traveler portal. */
  theme?: "dark" | "light";
}

function NavLink({
  item,
  collapsed,
  onNavigate,
  theme = "dark",
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
  theme?: "dark" | "light";
}) {
  const pathname = usePathname();
  const active =
    item.matchNested === false
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  const isLight = theme === "light";

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        collapsed && "justify-center px-2.5",
        isLight
          ? active
            ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
            : "text-text-secondary hover:bg-primary/5 hover:text-text-primary"
          : active
            ? "bg-[var(--sidebar-active)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "text-[var(--sidebar-fg)] hover:bg-white/6 hover:text-white",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-2 start-0 w-1 rounded-full bg-gradient-to-b from-accent to-accent-light transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        className={cn(
          "size-5 shrink-0 transition-colors",
          isLight
            ? active
              ? "text-primary"
              : "text-text-secondary group-hover:text-primary"
            : active
              ? "text-accent-light"
              : "text-[var(--sidebar-fg)] group-hover:text-white",
        )}
        strokeWidth={1.9}
      />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge !== undefined && item.badge > 0 && (
        <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip content={item.label} side="right">
        {link}
      </Tooltip>
    );
  }
  return link;
}

export function SidebarContent({
  groups,
  brand,
  footer,
  collapsed = false,
  onNavigate,
  theme = "dark",
}: SidebarProps & { collapsed?: boolean; onNavigate?: () => void }) {
  const isLight = theme === "light";

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center border-b px-4 py-4",
          isLight ? "border-border/60" : "border-white/8",
          collapsed && "justify-center px-2",
        )}
      >
        {brand}
      </div>

      <nav className="scrollbar-none min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group, index) => (
          <div key={group.label ?? index}>
            {group.label && !collapsed && (
              <p
                className={cn(
                  "mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider",
                  isLight ? "text-text-secondary/70" : "text-[var(--sidebar-fg)]/55",
                )}
              >
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  theme={theme}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {footer && (
        <div
          className={cn(
            "border-t p-3",
            isLight ? "border-border/60" : "border-white/8",
            collapsed && "p-2",
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

const subscribeNoop = () => () => {};

/** Desktop sidebar rail — collapsible, hidden on mobile (use Sheet via Topbar trigger). */
export function Sidebar({ theme = "dark", ...props }: SidebarProps) {
  const persistedCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const isLight = theme === "light";

  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const collapsed = hydrated ? persistedCollapsed : false;

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col transition-[width] duration-300 lg:flex",
        isLight
          ? "glass-strong border-e border-border/60 shadow-[4px_0_24px_rgba(48,112,130,0.08)]"
          : "bg-[var(--sidebar-bg)] shadow-[4px_0_24px_rgba(18,33,46,0.15)]",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <SidebarContent {...props} theme={theme} collapsed={collapsed} />
      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -end-3 top-16 flex size-6 items-center justify-center rounded-full",
          "border border-border bg-surface text-text-secondary shadow-md transition-colors hover:text-primary",
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-3.5 rtl:rotate-180" />
        ) : (
          <PanelLeftClose className="size-3.5 rtl:rotate-180" />
        )}
      </button>
    </aside>
  );
}
