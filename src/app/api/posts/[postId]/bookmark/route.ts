import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";

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
        bookmarks: {
          where: {
            userId: loggedInUser.id,
          },

          select: {
            userId: true,
          },
        },
      },
    });

    if (!post)
      return Response.json({ message: "Post not found" }, { status: 404 });

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!post.bookmarks.length,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params: { postId } }: Params) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.bookmark.upsert({
      where: {
        userId_postId: {
          postId,
          userId: loggedInUser.id,
        },
      },

      create: {
        postId,
        userId: loggedInUser.id,
      },

      update: {},
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params: { postId } }: Params) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.bookmark.deleteMany({
      where: {
        postId,
        userId: loggedInUser.id,
      },
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
