"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "../ui/input";
import React, { useState } from "react";
import Eye from "@/assets/icons/Eye";
import { Button } from "../ui/button";
import HiddenEye from "@/assets/icons/HiddenEye";

type FormFieldProps = {
  label: string;
  type: "password";
  register: UseFormRegister<any>;
  name: string;
  placeholder: string;
  error: FieldErrors;
};

const PasswordInputField = ({
  error,
  label,
  name,
  placeholder,
  register,
  type,
}: FormFieldProps) => {
  const [isShowPassword, setisShowPassword] = useState(true);
  return (
    <div className="">
      <label htmlFor={name} className="capitalize">
        {label}
      </label>
      <div className="relative">
        <Input
          type={isShowPassword ? type : "text"}
          autoComplete="off"
          {...register(`${name}`)}
          id={name}
          placeholder={placeholder}
          className="rounded-[.5rem]"
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-0 top-1/2 -translate-y-1/2"
          icon={
            isShowPassword ? (
              <HiddenEye className="w-[1.3rem]" />
            ) : (
              <Eye className="w-[1.3rem]" />
            )
          }
          onClick={() => {
            setisShowPassword(!isShowPassword);
          }}
        />
      </div>
      {error[name] && (
        <span className="text-sm text-red-500">
          {error[name].message as string}
        </span>
      )}
    </div>
  );
};

export default PasswordInputField;
