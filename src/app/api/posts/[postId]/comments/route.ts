import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

type Params = {
  params: {
    postId: string;
  };
};

export async function GET(req: NextRequest, { params: { postId } }: Params) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // to determine where the next fetch is in(prisma database)
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: { createdAt: "desc" },
      include: getCommentDataInclude(user.id),
      // take: -pageSize - 1, // reverse
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    // const prevCursor = comments.length > pageSize ? comments[0].id : null; // reverse

    const nextCursor =
      comments.length > pageSize ? comments[pageSize].id : null;

    const data: CommentsPage = {
      // comments: comments.length > pageSize ? comments.slice(1) : comments, // reverse
      comments: comments.slice(0, pageSize),
      prevCursor: nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
