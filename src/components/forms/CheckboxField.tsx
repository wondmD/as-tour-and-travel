"use client";

import { useField } from "formik";
import { CircleAlert } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Checkbox } from "@/components/ui/Checkbox";

interface CheckboxFieldProps {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField({
  name,
  label,
  description,
  disabled,
  className,
}: CheckboxFieldProps) {
  const [field, meta, helpers] = useField<boolean>({ name, type: "checkbox" });
  const invalid = Boolean(meta.touched && meta.error);

  return (
    <div className={cn("w-full", className)}>
      <Checkbox
        name={name}
        checked={field.checked ?? false}
        onCheckedChange={(checked) => {
          helpers.setValue(checked);
          helpers.setTouched(true, false);
        }}
        label={label}
        description={description}
        disabled={disabled}
        invalid={invalid}
      />
      {invalid && (
        <p
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger"
        >
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          {meta.error}
        </p>
      )}
    </div>
  );
}
