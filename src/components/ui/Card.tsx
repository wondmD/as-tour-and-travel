import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "glass" | "solid" | "outline" | "gradient";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Disable the hover lift/shadow (for static dashboard panels). */
  static?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  glass: "glass-card",
  solid:
    "rounded-[var(--radius-card)] border border-border/70 bg-surface shadow-[0_1px_2px_rgba(18,33,46,0.04),0_8px_24px_rgba(48,112,130,0.05)]",
  outline: "rounded-[var(--radius-card)] border border-border bg-transparent",
  gradient: "gradient-border shadow-[0_8px_32px_rgba(48,112,130,0.07)]",
};

export function Card({
  variant = "glass",
  static: isStatic,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        isStatic && "hover:shadow-none hover:border-border/70",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  actions,
}: {
  className?: string;
  children: ReactNode;
  /** Right-aligned header actions (buttons, menus). */
  actions?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 px-5 pb-0 pt-5 sm:px-6 sm:pt-6",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3
      className={cn(
        "font-heading text-base font-semibold text-text-primary",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("mt-1 text-sm text-text-secondary", className)}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("px-5 py-5 sm:px-6", className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-border/50 px-5 py-4 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
