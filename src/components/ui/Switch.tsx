"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  name,
  id: idProp,
  className,
}: SwitchProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  const control = (
    <SwitchPrimitive.Root
      id={id}
      name={name}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors duration-300",
        "bg-text-secondary/25 shadow-[inset_0_1px_2px_rgba(18,33,46,0.12)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
        "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-primary-light",
        "disabled:cursor-not-allowed disabled:opacity-50",
        !label && className,
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-5 translate-x-0.5 rounded-full bg-white shadow-md transition-transform duration-300",
          "data-[state=checked]:translate-x-[1.375rem] rtl:data-[state=checked]:-translate-x-[1.375rem]",
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label) return control;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
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
      {control}
    </div>
  );
}
