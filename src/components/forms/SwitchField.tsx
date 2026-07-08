"use client";

import { useField } from "formik";
import { type ReactNode } from "react";
import { Switch } from "@/components/ui/Switch";

interface SwitchFieldProps {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SwitchField({
  name,
  label,
  description,
  disabled,
  className,
}: SwitchFieldProps) {
  const [field, , helpers] = useField<boolean>({ name, type: "checkbox" });

  return (
    <Switch
      name={name}
      checked={field.checked ?? false}
      onCheckedChange={(checked) => {
        helpers.setValue(checked);
        helpers.setTouched(true, false);
      }}
      label={label}
      description={description}
      disabled={disabled}
      className={className}
    />
  );
}
