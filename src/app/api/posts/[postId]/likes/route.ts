import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

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
        likes: {
          where: {
            userId: loggedInUser.id,
          },

          select: {
            userId: true,
          },
        },

        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    if (!post)
      return Response.json({ message: "Post not found" }, { status: 404 });

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post)
      return Response.json({ message: "Post Not Found" }, { status: 404 });

    // transaction in prisma if one operation is unsuccessful the other will rollback or will also fails
    await prisma.$transaction([
      prisma.like.upsert({
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
      }),
      ...(loggedInUser.id !== post.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post)
      return Response.json({ message: "Post Not Found" }, { status: 404 });

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          postId,
          userId: loggedInUser.id,
        },
      }),

      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId,
          type: "LIKE",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
