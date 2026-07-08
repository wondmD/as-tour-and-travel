"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type DialogSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  /** Hide the built-in close button (e.g. for must-confirm dialogs). */
  hideClose?: boolean;
}

export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
  hideClose = false,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="overlay-fade fixed inset-0 z-[80] bg-primary-dark/45 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "dialog-pop fixed left-1/2 top-1/2 z-[81] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-3xl",
            "glass-strong shadow-2xl shadow-primary-dark/20",
            sizeClasses[size],
          )}
        >
          <div className="flex items-start justify-between gap-4 px-6 pb-0 pt-6">
            <div className="min-w-0">
              <DialogPrimitive.Title className="font-heading text-lg font-semibold text-text-primary">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-1 text-sm text-text-secondary">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            {!hideClose && (
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
            )}
          </div>

          {children && <div className="px-6 py-5">{children}</div>}

          {footer && (
            <div className="flex flex-col-reverse gap-2 border-t border-border/50 px-6 py-4 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export const DialogClose = DialogPrimitive.Close;
