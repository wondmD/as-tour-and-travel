"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  /** "pills" for glass pill triggers, "underline" for a classic tab bar. */
  appearance?: "pills" | "underline";
  className?: string;
}

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  appearance = "pills",
  className,
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsPrimitive.List
        className={cn(
          "scrollbar-none flex max-w-full items-center gap-1 overflow-x-auto",
          appearance === "pills"
            ? "w-fit rounded-2xl border border-border/60 bg-white/50 p-1 backdrop-blur-md"
            : "border-b border-border/70",
        )}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              "whitespace-nowrap text-sm font-medium text-text-secondary outline-none transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-primary/40",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
              appearance === "pills"
                ? cn(
                    "rounded-xl px-4 py-2",
                    "hover:text-text-primary",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light",
                    "data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/25",
                  )
                : cn(
                    "-mb-px border-b-2 border-transparent px-4 py-2.5",
                    "hover:text-text-primary",
                    "data-[state=active]:border-primary data-[state=active]:font-semibold data-[state=active]:text-primary",
                  ),
            )}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="mt-4 outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
