"use client";

import { useFormikContext } from "formik";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

/** Submit button wired to Formik's isSubmitting state. */
export function SubmitButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "accent" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}) {
  const { isSubmitting } = useFormikContext();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={isSubmitting}
      className={className}
    >
      {children}
    </Button>
  );
}
