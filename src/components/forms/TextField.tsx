"use client";

import { useField } from "formik";
import { type ReactNode } from "react";
import { Input, type InputProps } from "@/components/ui/Input";
import { FormField, type FieldShellProps } from "./FormField";

export interface TextFieldProps
  extends FieldShellProps,
    Omit<InputProps, "name" | "id" | "invalid" | "className"> {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  inputClassName?: string;
}

export function TextField({
  name,
  label,
  hint,
  required,
  className,
  inputClassName,
  ...inputProps
}: TextFieldProps) {
  const [field] = useField(name);

  return (
    <FormField
      name={name}
      label={label}
      hint={hint}
      required={required}
      className={className}
    >
      {({ id, invalid, describedBy }) => (
        <Input
          id={id}
          invalid={invalid}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={inputClassName}
          {...field}
          {...inputProps}
        />
      )}
    </FormField>
  );
}
