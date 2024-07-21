import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "required field")
      .email("Inavlid Email Address"),
    username: z
      .string()
      .trim()
      .min(1, "required field")
      .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
    password: z
      .string()
      .trim()
      .min(1, "required field")
      .min(8, "Must be at least 8 characters"),

    confirmPassword: z.string().trim().min(1, "required field"),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  username: z.string().trim().min(1, "required field"),
  password: z.string().trim().min(1, "required field"),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

type LoginSchemaKeys = keyof z.infer<typeof loginSchema>;

export type LoginSchemaType = z.infer<typeof loginSchema>;
