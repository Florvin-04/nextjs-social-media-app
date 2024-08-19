"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { commentSchema } from "@/lib/validation";

type Props = {
  post: PostData;
  content: string;
};

export async function handleSubmitCommentAction({ content, post }: Props) {
  // console.log({ post, content });

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content: validatedContent } = commentSchema.parse({ content });

  const createdComment = await prisma.comment.create({
    data: {
      content: validatedContent,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return createdComment;
}
