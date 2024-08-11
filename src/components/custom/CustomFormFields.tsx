"use client";

import { Control, useController, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import React from "react";
import { Textarea } from "../ui/textarea";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  enableTexArea?: boolean;
} & (React.ComponentProps<"input"> | React.ComponentProps<"textarea">);

const CustomFormFields = <T extends FieldValues>({
  label,
  control,
  name,
  enableTexArea,
  ...inputProps
}: FormFieldProps<T>) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="capitalize">
          {label}
        </label>
      )}
      {enableTexArea ? (
        <Textarea
          {...control.register(name)}
          {...(inputProps as React.ComponentProps<"textarea">)}
        />
      ) : (
        <Input
          {...(inputProps as React.ComponentProps<"input">)}
          autoComplete="off"
          {...control.register(name)}
          className="rounded-[.5rem]"
        />
      )}

      {errors[name] && (
        <span className="text-sm text-red-500">
          {errors[name].message as string}
        </span>
      )}
    </div>
  );
};

export default CustomFormFields;
