"use client";

import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/cn";

type StatTone = "primary" | "accent" | "success" | "info";

const iconTones: Record<StatTone, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/12 text-accent",
  success: "bg-[var(--success-soft)] text-success",
  info: "bg-[var(--info-soft)] text-info",
};

const sparkColors: Record<StatTone, string> = {
  primary: "#307082",
  accent: "#ea9940",
  success: "#2f8f6b",
  info: "#4d7fa8",
};

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: StatTone;
  /** Percentage change vs. previous period, e.g. 12.4 or -3.1. */
  delta?: number;
  deltaLabel?: string;
  /** Small trend series rendered as a sparkline behind the card footer. */
  trend?: number[];
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  delta,
  deltaLabel = "vs last period",
  trend,
  className,
}: StatCardProps) {
  const isUp = delta !== undefined && delta >= 0;
  const gradientId = `stat-spark-${tone}`;

  return (
    <div
      className={cn(
        "glass-card relative overflow-hidden p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary/80">
            {label}
          </p>
          <p className="mt-2 font-heading text-2xl font-bold tabular-nums text-text-primary sm:text-3xl">
            {value}
          </p>
        </div>
        {Icon && (
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl",
              iconTones[tone],
            )}
          >
            <Icon className="size-5" strokeWidth={1.9} />
          </span>
        )}
      </div>

      {delta !== undefined && (
        <p className="relative z-10 mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-semibold",
              isUp
                ? "bg-[var(--success-soft)] text-success"
                : "bg-[var(--danger-soft)] text-danger",
            )}
          >
            {isUp ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {isUp ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          <span className="text-text-secondary/80">{deltaLabel}</span>
        </p>
      )}

      {trend && trend.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 opacity-70">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trend.map((y, i) => ({ i, y }))}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={sparkColors[tone]}
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor={sparkColors[tone]}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke={sparkColors[tone]}
                strokeWidth={1.75}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
