import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

type Params = {
  params: {
    userId: string;
  };
};

export const GET = async (req: Request, { params: { userId } }: Params) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },

        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    // console.log(JSON.stringify(user, null, 2));

    if (!user)
      return Response.json({ message: "User not found" }, { status: 404 });

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: Request, { params: { userId } }: Params) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.$transaction([
      prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: loggedInUser.id,
            followingId: userId,
          },
        },

        create: {
          followerId: loggedInUser.id,
          followingId: userId,
        },

        update: {},
      }),

      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params: { userId } }: Params) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.$transaction([
      prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      }),

      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
