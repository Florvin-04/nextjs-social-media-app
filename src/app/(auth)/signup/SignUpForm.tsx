"use client";

import { signUpSchema, SignUpSchemaType } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import CustomFormFields from "@/components/custom/CustomFormFields";
import PasswordInputField from "@/components/custom/PasswordInputField";
import { useState, useTransition } from "react";
import { handleSignUpAction } from "./action";
import { toast } from "@/components/ui/use-toast";

function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const handleSubmitForm = (values: SignUpSchemaType) => {
    console.log({ values });

    startTransition(async () => {
      const { error } = await handleSignUpAction(values);

      if (error) {
        toast({
          title: "Something Went Wrong",
          variant: "destructive",
          description: error,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="px-3 py-2">
      <div className="space-y-4">
        <CustomFormFields
          type="text"
          error={errors}
          register={register}
          label="Email"
          name="email"
          placeholder="Email"
        />
        <CustomFormFields
          type="text"
          error={errors}
          register={register}
          label="Username"
          name="username"
          placeholder="Username"
        />
        <PasswordInputField
          type="password"
          error={errors}
          register={register}
          label="Password"
          name="password"
          placeholder="Password"
        />
        <PasswordInputField
          type="password"
          error={errors}
          register={register}
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm Password"
        />
      </div>

      <div className="mt-5 text-center">
        <Button isLoading={isPending} className="w-full">
          Create account
        </Button>
      </div>
    </form>
  );
}

export default SignUpForm;
