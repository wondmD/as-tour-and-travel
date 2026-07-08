"use client";

import { useField } from "formik";
import { Textarea, type TextareaProps } from "@/components/ui/Textarea";
import { FormField, type FieldShellProps } from "./FormField";

export interface TextareaFieldProps
  extends FieldShellProps,
    Omit<TextareaProps, "name" | "id" | "invalid" | "className"> {
  textareaClassName?: string;
}

export function TextareaField({
  name,
  label,
  hint,
  required,
  className,
  textareaClassName,
  ...textareaProps
}: TextareaFieldProps) {
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
        <Textarea
          id={id}
          invalid={invalid}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={textareaClassName}
          {...field}
          {...textareaProps}
        />
      )}
    </FormField>
  );
}
