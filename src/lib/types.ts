import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUser: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    followers: {
      where: {
        followerId: loggedInUser,
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
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUser: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUser),
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type PostPage = {
  posts: PostData[];
  nextCursor: string | null;
};

export type FollowerInfo = {
  followers: number;
  isFollowedByUser: boolean;
};
