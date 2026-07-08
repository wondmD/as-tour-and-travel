import { type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-sm font-medium text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ms-1 text-danger" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}
