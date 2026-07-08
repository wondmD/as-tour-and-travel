"use client";

import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MenuAction {
  type?: "item";
  label: ReactNode;
  icon?: LucideIcon;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface MenuSeparator {
  type: "separator";
}

export interface MenuLabel {
  type: "label";
  label: ReactNode;
}

export type MenuEntry = MenuAction | MenuSeparator | MenuLabel;

interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuEntry[];
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "end",
  side = "bottom",
  className,
}: DropdownMenuProps) {
  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger asChild>{trigger}</MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          align={align}
          side={side}
          sideOffset={6}
          className={cn(
            "popover-pop z-[70] min-w-48 overflow-hidden rounded-2xl border border-border/70",
            "bg-white/95 p-1.5 shadow-xl shadow-primary/10 backdrop-blur-xl",
            className,
          )}
        >
          {items.map((entry, index) => {
            if (entry.type === "separator") {
              return (
                <MenuPrimitive.Separator
                  key={index}
                  className="mx-2 my-1.5 h-px bg-border/60"
                />
              );
            }
            if (entry.type === "label") {
              return (
                <MenuPrimitive.Label
                  key={index}
                  className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70"
                >
                  {entry.label}
                </MenuPrimitive.Label>
              );
            }
            const Icon = entry.icon;
            return (
              <MenuPrimitive.Item
                key={index}
                disabled={entry.disabled}
                onSelect={entry.onSelect}
                className={cn(
                  "flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none transition-colors",
                  entry.destructive
                    ? "text-danger data-[highlighted]:bg-danger/8"
                    : "text-text-primary data-[highlighted]:bg-primary/8 data-[highlighted]:text-primary",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
                )}
              >
                {Icon && <Icon className="size-4 shrink-0 opacity-80" />}
                {entry.label}
              </MenuPrimitive.Item>
            );
          })}
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}
