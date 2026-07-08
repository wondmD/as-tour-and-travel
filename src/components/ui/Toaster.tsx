"use client";

import { Toaster as SonnerToaster } from "sonner";

export { toast } from "sonner";

/** Brand-styled toast host — mount once in AppProviders. */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !border-border/70 !bg-white/92 !backdrop-blur-xl !shadow-xl !shadow-primary/10 !text-text-primary !font-sans",
          title: "!text-sm !font-semibold",
          description: "!text-xs !text-text-secondary",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-danger",
          warning: "[&_[data-icon]]:!text-warning",
          info: "[&_[data-icon]]:!text-info",
          actionButton: "!bg-primary !text-white !rounded-lg !text-xs",
          cancelButton:
            "!bg-transparent !text-text-secondary !rounded-lg !text-xs",
        },
      }}
    />
  );
}
