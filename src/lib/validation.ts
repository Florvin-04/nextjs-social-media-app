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

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "required field"),
  password: z.string().trim().min(1, "required field"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "required field"),
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type CreatePostType = z.infer<typeof createPostSchema>;

// ** To you can also update profile pic but it it already handled by core.ts in uploadthing server
export const updateUserProfileScheme = z.object({
  displayName: z.string().trim().min(1, "required field"),
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileScheme>;

export const commentSchema = z.object({
  content: z.string().trim().min(1, "required field"),
});

export type commentValues = z.infer<typeof commentSchema>;
