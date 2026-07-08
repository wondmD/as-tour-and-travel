import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  /** Show a small status dot before the text. */
  dot?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-text-secondary/10 text-text-secondary border-text-secondary/15",
  primary: "bg-primary/10 text-primary border-primary/15",
  accent: "bg-accent/12 text-[#b06f24] border-accent/20",
  success: "bg-[var(--success-soft)] text-success border-success/20",
  warning: "bg-[var(--warning-soft)] text-[#a06e1f] border-warning/25",
  danger: "bg-[var(--danger-soft)] text-danger border-danger/20",
  info: "bg-[var(--info-soft)] text-info border-info/20",
  outline: "bg-transparent text-text-secondary border-border",
};

const dotColors: Record<BadgeVariant, string> = {
  neutral: "bg-text-secondary",
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  outline: "bg-text-secondary",
};

export function Badge({
  children,
  variant = "neutral",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("size-1.5 shrink-0 rounded-full", dotColors[variant])}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

/** Booking / payment lifecycle states mapped to badge styling. */
export type StatusKind =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "refunded"
  | "failed"
  | "draft"
  | "active";

const statusMap: Record<StatusKind, { variant: BadgeVariant; label: string }> =
  {
    confirmed: { variant: "success", label: "Confirmed" },
    completed: { variant: "info", label: "Completed" },
    active: { variant: "primary", label: "Active" },
    pending: { variant: "warning", label: "Pending" },
    draft: { variant: "neutral", label: "Draft" },
    cancelled: { variant: "danger", label: "Cancelled" },
    failed: { variant: "danger", label: "Failed" },
    refunded: { variant: "neutral", label: "Refunded" },
  };

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: StatusKind;
  label?: string;
  className?: string;
}) {
  const config = statusMap[status];
  return (
    <Badge variant={config.variant} dot className={className}>
      {label ?? config.label}
    </Badge>
  );
}
