"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/cn";

type ProgressTone = "primary" | "accent" | "success" | "warning" | "danger";

const tones: Record<ProgressTone, string> = {
  primary: "from-primary to-primary-light",
  accent: "from-accent to-accent-light",
  success: "from-success to-[#48a684]",
  warning: "from-warning to-[#e6b365]",
  danger: "from-danger to-[#d4736c]",
};

export function Progress({
  value,
  max = 100,
  tone = "primary",
  label,
  showValue = false,
  className,
}: {
  value: number;
  max?: number;
  tone?: ProgressTone;
  label?: string;
  showValue?: boolean;
  className?: string;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label && (
            <span className="text-xs font-medium text-text-secondary">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs font-semibold tabular-nums text-text-primary">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        value={value}
        max={max}
        className="h-2 w-full overflow-hidden rounded-full bg-text-secondary/12"
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out",
            tones[tone],
          )}
          style={{ width: `${percent}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
