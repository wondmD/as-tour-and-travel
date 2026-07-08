"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { inputBaseClasses, inputInvalidClasses } from "./Input";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  placeholder = "Select…",
  options = [],
  groups,
  disabled,
  invalid,
  name,
  id,
  className,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(
          inputBaseClasses,
          "flex min-h-11 items-center justify-between gap-2 px-4 py-2.5 text-start",
          "data-[placeholder]:text-text-secondary/60",
          invalid && inputInvalidClasses,
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-4 text-text-secondary/70" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "z-[70] max-h-[min(24rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)]",
            "overflow-hidden rounded-2xl border border-border/70 bg-white/95 shadow-xl shadow-primary/10 backdrop-blur-xl",
            "popover-pop",
          )}
        >
          <SelectPrimitive.ScrollUpButton className="flex justify-center py-1 text-text-secondary">
            <ChevronUp className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1.5">
            {groups
              ? groups.map((group) => (
                  <SelectPrimitive.Group key={group.label}>
                    <SelectPrimitive.Label className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">
                      {group.label}
                    </SelectPrimitive.Label>
                    {group.options.map((option) => (
                      <SelectItem key={option.value} option={option} />
                    ))}
                  </SelectPrimitive.Group>
                ))
              : options.map((option) => (
                  <SelectItem key={option.value} option={option} />
                ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex justify-center py-1 text-text-secondary">
            <ChevronDown className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

function SelectItem({ option }: { option: SelectOption }) {
  return (
    <SelectPrimitive.Item
      value={option.value}
      disabled={option.disabled}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-xl py-2 pe-9 ps-3 text-sm text-text-primary outline-none",
        "data-[highlighted]:bg-primary/8 data-[highlighted]:text-primary",
        "data-[state=checked]:font-semibold data-[state=checked]:text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
      )}
    >
      <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute end-3">
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
