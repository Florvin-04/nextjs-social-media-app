"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { commentSchema } from "@/lib/validation";

type CreateNewPostProps = {
  post: PostData;
  content: string;
};

export async function handleSubmitCommentAction({
  content,
  post,
}: CreateNewPostProps) {
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

export async function handleDeleteCommentAction(commentId: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) throw new Error("Comment not Found");
  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return deletedComment;
}
