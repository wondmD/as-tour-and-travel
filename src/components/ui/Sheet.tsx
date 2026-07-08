"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SheetSide = "start" | "end" | "bottom";

const sideClasses: Record<SheetSide, string> = {
  start:
    "sheet-in-start inset-y-0 start-0 h-dvh w-[min(20rem,85vw)] border-e border-border/50",
  end: "sheet-in-end inset-y-0 end-0 h-dvh w-[min(24rem,92vw)] border-s border-border/50",
  bottom:
    "sheet-in-bottom inset-x-0 bottom-0 max-h-[85dvh] rounded-t-3xl border-t border-border/50",
};

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: SheetSide;
  /** Extra classes on the panel (e.g. custom width). */
  className?: string;
}

/** Slide-in panel — used for mobile navigation, filters, and quick-view details. */
export function Sheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  side = "end",
  className,
}: SheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="overlay-fade fixed inset-0 z-[80] bg-primary-dark/45 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-[81] flex flex-col bg-surface/95 shadow-2xl shadow-primary-dark/25 backdrop-blur-2xl",
            sideClasses[side],
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border/50 px-5 py-4">
            <div className="min-w-0">
              <DialogPrimitive.Title className="font-heading text-base font-semibold text-text-primary">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-0.5 text-xs text-text-secondary">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors",
                "hover:bg-primary/8 hover:text-text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              )}
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>

          {footer && (
            <div className="safe-bottom flex flex-col-reverse gap-2 border-t border-border/50 px-5 py-3 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
