"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  invalid,
  name,
  id: idProp,
  className,
}: CheckboxProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  const box = (
    <CheckboxPrimitive.Root
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      onCheckedChange={(state) => onCheckedChange?.(state === true)}
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
        "border-border bg-[var(--input-bg)] shadow-[inset_0_1px_2px_rgba(18,33,46,0.04)]",
        "hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
        "data-[state=checked]:border-primary data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-primary data-[state=checked]:to-primary-light",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-danger/60",
        !label && className,
      )}
    >
      <CheckboxPrimitive.Indicator className="text-white data-[state=indeterminate]:text-primary">
        {checked === "indeterminate" ? (
          <Minus className="size-3.5" strokeWidth={3} />
        ) : (
          <Check className="size-3.5" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) return box;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="pt-0.5">{box}</span>
      <span className="min-w-0">
        <label
          htmlFor={id}
          className={cn(
            "block cursor-pointer text-sm font-medium text-text-primary",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {label}
        </label>
        {description && (
          <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
