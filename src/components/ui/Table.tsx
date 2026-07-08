import {
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/** Styled table primitives. Wrap in <TableContainer> for the card look + horizontal scroll on mobile. */

export function TableContainer({
  className,
  children,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-[var(--radius-card)] border border-border/70",
        "bg-white/55 shadow-[0_1px_2px_rgba(18,33,46,0.04),0_8px_24px_rgba(48,112,130,0.05)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)} {...props} />
  );
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-border/70 bg-primary/4", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border/50", className)} {...props} />;
}

export function TableRow({
  className,
  interactive,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { interactive?: boolean }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150",
        interactive && "cursor-pointer hover:bg-primary/4",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-text-secondary/80 first:ps-5 last:pe-5",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3.5 align-middle text-text-primary first:ps-5 last:pe-5",
        className,
      )}
      {...props}
    />
  );
}
