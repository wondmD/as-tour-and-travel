"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Popover({
  trigger,
  children,
  align = "center",
  side = "bottom",
  className,
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          side={side}
          sideOffset={8}
          className={cn(
            "popover-pop z-[70] w-72 rounded-2xl border border-border/70",
            "bg-white/95 p-4 shadow-xl shadow-primary/10 backdrop-blur-xl",
            className,
          )}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
