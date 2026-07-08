"use client";

import { useField } from "formik";
import {
  Select,
  type SelectGroup,
  type SelectOption,
} from "@/components/ui/Select";
import { FormField, type FieldShellProps } from "./FormField";

export interface SelectFieldProps extends FieldShellProps {
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({
  name,
  label,
  hint,
  required,
  className,
  options,
  groups,
  placeholder,
  disabled,
}: SelectFieldProps) {
  const [field, , helpers] = useField<string>(name);

  return (
    <FormField
      name={name}
      label={label}
      hint={hint}
      required={required}
      className={className}
    >
      {({ id, invalid }) => (
        <Select
          id={id}
          name={name}
          value={field.value}
          onValueChange={(value) => {
            helpers.setValue(value);
            helpers.setTouched(true, false);
          }}
          options={options}
          groups={groups}
          placeholder={placeholder}
          disabled={disabled}
          invalid={invalid}
        />
      )}
    </FormField>
  );
}
