"use client";

import {
  UseFormRegister,
  FieldErrors,
  Control,
  useController,
} from "react-hook-form";
import { Input } from "../ui/input";
import React, { useState } from "react";
import Eye from "@/assets/icons/Eye";
import { Button } from "../ui/button";
import HiddenEye from "@/assets/icons/HiddenEye";

type FormFieldProps = {
  control: Control<any>;
  label: string;
  type?: "password";
  name: string;
} & React.ComponentProps<"input">;

const PasswordInputField = ({
  label,
  name,
  control,
  type = "password",
}: FormFieldProps) => {
  const {
    formState: { errors },
  } = useController({ name, control });

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
          {...control.register(`${name}`)}
          id={name}
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
      {errors[name] && (
        <span className="text-sm text-red-500">
          {errors[name].message as string}
        </span>
      )}
    </div>
  );
};

export default PasswordInputField;
