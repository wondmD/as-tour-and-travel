"use client";

import { useField } from "formik";
import { CircleAlert } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/Label";

export interface FieldShellProps {
  name: string;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
}

/**
 * Shared Formik field chrome: label, hint, and Yup validation error rendered
 * next to the control (SRS USE-02). Children receive the wiring they need.
 */
export function FormField({
  name,
  label,
  hint,
  required,
  className,
  children,
}: FieldShellProps & {
  children: (args: {
    id: string;
    invalid: boolean;
    describedBy?: string;
  }) => ReactNode;
}) {
  const [, meta] = useField(name);
  const id = useId();
  const invalid = Boolean(meta.touched && meta.error);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = invalid ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {children({ id, invalid, describedBy })}
      {invalid ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger"
        >
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          {meta.error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-text-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
