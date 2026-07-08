import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Call-to-action, typically a <Button>. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary">
          <Icon className="size-7" strokeWidth={1.75} />
        </span>
      )}
      <h3 className="font-heading text-base font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
