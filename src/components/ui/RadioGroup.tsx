"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  name?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  /** "cards" renders each option as a selectable bordered card. */
  appearance?: "plain" | "cards";
  className?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  options,
  name,
  disabled,
  orientation = "vertical",
  appearance = "plain",
  className,
}: RadioGroupProps) {
  const groupId = useId();

  return (
    <RadioPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      orientation={orientation}
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className,
      )}
    >
      {options.map((option) => {
        const id = `${groupId}-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer items-start gap-3",
              appearance === "cards" &&
                cn(
                  "rounded-2xl border border-border bg-[var(--input-bg)] p-4 transition-all duration-200",
                  "hover:border-primary/35 has-[[data-state=checked]]:border-primary/60",
                  "has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:shadow-md has-[[data-state=checked]]:shadow-primary/10",
                ),
              option.disabled && "cursor-not-allowed opacity-55",
            )}
          >
            <RadioPrimitive.Item
              id={id}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                "border-border bg-white hover:border-primary/40",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
                "data-[state=checked]:border-primary",
              )}
            >
              <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-gradient-to-br from-primary to-primary-light" />
            </RadioPrimitive.Item>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text-primary">
                {option.label}
              </span>
              {option.description && (
                <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </RadioPrimitive.Root>
  );
}
