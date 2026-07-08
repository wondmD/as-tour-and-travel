"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/lib/stores/ui";
import { Sheet } from "@/components/ui/Sheet";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { Sidebar, SidebarContent, type NavGroup } from "./Sidebar";

interface DashboardShellProps {
  groups: NavGroup[];
  brand: ReactNode;
  sidebarFooter?: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
  theme?: "dark" | "light";
}

/**
 * Responsive dashboard layout:
 * - ≥lg: fixed dark sidebar rail (collapsible) + sticky topbar + scrollable content
 * - <lg: sidebar becomes a slide-in sheet triggered from the topbar menu button
 */
export function DashboardShell({
  groups,
  brand,
  sidebarFooter,
  topbar,
  children,
  theme = "dark",
}: DashboardShellProps) {
  const mobileOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const isLight = theme === "light";

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh bg-background">
        <Sidebar groups={groups} brand={brand} footer={sidebarFooter} theme={theme} />

        <Sheet
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          side="start"
          title="Menu"
          className={cn(
            "!p-0 [&>div:first-child]:hidden",
            isLight ? "!bg-surface/95" : "!bg-[var(--sidebar-bg)]",
          )}
        >
          <div className="-mx-5 -my-4 h-[calc(100%+2rem)]">
            <SidebarContent
              groups={groups}
              brand={brand}
              footer={sidebarFooter}
              theme={theme}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          {topbar}
          <main className="pattern-surface min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
