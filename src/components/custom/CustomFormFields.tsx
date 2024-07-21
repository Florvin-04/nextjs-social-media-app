"use client";

import { UseFormRegister, FieldErrors, FieldError } from "react-hook-form";
import { Input } from "../ui/input";
import React from "react";
import PasswordInputField from "./PasswordInputField";

type FormFieldProps = {
  label: string;
  register: UseFormRegister<any>;
  name: string;
  placeholder: string;
  error: FieldErrors;
} & React.InputHTMLAttributes<HTMLInputElement>;

const CustomFormFields = ({
  error,
  label,
  name,
  placeholder,
  register,
  type,
}: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="capitalize">
        {label}
      </label>
      <Input
        type={type}
        autoComplete="off"
        {...register(`${name}`)}
        id={name}
        placeholder={placeholder}
        className="rounded-[.5rem]"
      />
      {error[name] && (
        <span className="text-sm text-red-500">
          {error[name].message as string}
        </span>
      )}
    </div>
  );
};

export default CustomFormFields;
