import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsInfo, getCommentDataInclude } from "@/lib/types";

type Params = {
  params: {
    postId: string;
  };
};

export async function GET(req: Request, { params: { postId } }: Params) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ message: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },

      select: {
        comments: {
          where: {
            userId: loggedInUser.id,
          },

          select: {
            userId: true,
          },
        },

        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post)
      return Response.json({ message: "Post not found" }, { status: 404 });

    const data: CommentsInfo = {
      comments: post._count.comments,
    };
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
