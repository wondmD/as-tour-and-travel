"use client";

import { useField } from "formik";
import { RadioGroup, type RadioOption } from "@/components/ui/RadioGroup";
import { FormField, type FieldShellProps } from "./FormField";

export interface RadioGroupFieldProps extends FieldShellProps {
  options: RadioOption[];
  orientation?: "vertical" | "horizontal";
  appearance?: "plain" | "cards";
  disabled?: boolean;
}

export function RadioGroupField({
  name,
  label,
  hint,
  required,
  className,
  options,
  orientation,
  appearance,
  disabled,
}: RadioGroupFieldProps) {
  const [field, , helpers] = useField<string>(name);

  return (
    <FormField
      name={name}
      label={label}
      hint={hint}
      required={required}
      className={className}
    >
      {() => (
        <RadioGroup
          name={name}
          value={field.value}
          onValueChange={(value) => {
            helpers.setValue(value);
            helpers.setTouched(true, false);
          }}
          options={options}
          orientation={orientation}
          appearance={appearance}
          disabled={disabled}
        />
      )}
    </FormField>
  );
}
