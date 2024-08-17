"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

type Props = {
  content: string;
  mediaIds: string[];
};

export const handleSubmitPostAction = async (userPost: Props) => {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthentorized");

  const { content: parsedContent, mediaIds } = createPostSchema.parse(userPost);

  const newPost = await prisma.post.create({
    data: {
      content: parsedContent,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },

    include: getPostDataInclude(user.id),
  });

  return newPost;
};
