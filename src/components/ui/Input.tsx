"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Icon or element rendered at the reading-start edge (RTL-safe). */
  startAdornment?: ReactNode;
  /** Icon or element rendered at the reading-end edge (RTL-safe). */
  endAdornment?: ReactNode;
  invalid?: boolean;
}

export const inputBaseClasses = cn(
  "w-full rounded-[var(--radius-field)] border border-border bg-[var(--input-bg)] text-sm text-text-primary",
  "placeholder:text-text-secondary/60 shadow-[inset_0_1px_2px_rgba(18,33,46,0.03)]",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "hover:border-primary/30",
  "focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10",
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:saturate-50",
);

export const inputInvalidClasses =
  "border-danger/60 focus:border-danger focus:ring-danger/10";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, startAdornment, endAdornment, invalid, ...props },
  ref,
) {
  const field = (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        inputBaseClasses,
        "min-h-11 px-4 py-2.5",
        startAdornment && "ps-10",
        endAdornment && "pe-10",
        invalid && inputInvalidClasses,
        className,
      )}
      {...props}
    />
  );

  if (!startAdornment && !endAdornment) return field;

  return (
    <div className="relative">
      {startAdornment && (
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-text-secondary/70 [&_svg]:size-4">
          {startAdornment}
        </span>
      )}
      {field}
      {endAdornment && (
        <span className="absolute inset-y-0 end-3 flex items-center text-text-secondary/70 [&_svg]:size-4">
          {endAdornment}
        </span>
      )}
    </div>
  );
});
