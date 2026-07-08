import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-9",
} as const;

export function Spinner({
  size = "md",
  label,
  className,
}: {
  size?: keyof typeof sizes;
  label?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-2.5 text-text-secondary",
        className,
      )}
    >
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {label && <span className="text-sm">{label}</span>}
      <span className="sr-only">{label ?? "Loading"}</span>
    </span>
  );
}
