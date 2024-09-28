"use client";

import { handleLoginAction } from "@/app/(auth)/login/action";
import CustomFormField from "@/components/custom/CustomFormField";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

type Props = {};

export default function FormPage({}: Props) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(any),
    // defaultValues: {
    //   password: "",
    //   username: "",
    // },
  });
  const handleSubmitForm = (values: any) => {
    console.log({ values });

    // startTransition(async () => {
    //   const { error } = await handleLoginAction(values);

    //   if (error) {
    //     toast({
    //       title: "Something Went Wrong",
    //       variant: "destructive",
    //       description: error,
    //     });
    //   }
    // });
  };

  

  return (
    <div className="w-full bg-card">
      <h1>Form Practice Page</h1>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="px-3 py-2">
        <CustomFormField
          control={control}
          type="text"
          placeholder="Username"
          name="username"
          label="Username"
        />
        <CustomFormField
          control={control}
          type="textarea"
          placeholder="Bio"
          name="bio"
          label="Bio"
        />
        <CustomFormField
          control={control}
          type="customField"
          placeholder="Geneder"
          name="gender"
          label="Gender"
          renderCustomField={({ field, additionalParam }) => {
            console.log("renderCustomField", additionalParam);
            return (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">Option Two</Label>
                </div>
              </RadioGroup>
            );
          }}
        />

        <CustomFormField
          control={control}
          type="select"
          name="theme"
          label="Theme"
        >
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
        </CustomFormField>

        <div className="mt-3">
          <Button disabled={isPending} isLoading={isPending} className="w-full">
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
}
