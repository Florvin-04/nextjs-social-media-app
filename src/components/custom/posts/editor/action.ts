"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation";

type Props = {
  content: string;
};

export const handleSubmitPostAction = async ({ content }: Props) => {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthentorized");

  const { content: parsedContent } = createPostSchema.parse({ content });

  await prisma.post.create({
    data: {
      content: parsedContent,
      userId: user.id,
    },
  });
};
