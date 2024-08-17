"use client";

import CustomFormFields from "@/components/custom/CustomFormFields";
import PasswordInputField from "@/components/custom/PasswordInputField";
import { Button } from "@/components/ui/button";
import { loginSchema, LoginSchemaType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { handleLoginAction } from "./action";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      username: "",
    },
  });

  const handleSubmitForm = (values: LoginSchemaType) => {
    // console.log({ values });

    startTransition(async () => {
      const { error } = await handleLoginAction(values);

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
      <div className="space-y-3">
        // name should be one of the key in the schema
        <CustomFormFields
          control={control}
          type="text"
          label="Username"
          name="username"
          placeholder="Username"
        />
        <PasswordInputField
          control={control}
          label="Password"
          name="password"
          placeholder="Password"
        />
      </div>
      <div className="mt-3">
        <Button disabled={isPending} isLoading={isPending} className="w-full">
          Log In
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
