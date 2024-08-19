import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUser: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
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
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

// export function getLikeInfo(loggedInUser: string) {
//   return {
//     likes: {
//       where: {
//         userId: loggedInUser,
//       },

//       select: {
//         userId: true,
//       },
//     },

//     _count: {
//       select: {
//         likes: true,
//       },
//     },
//   } satisfies Prisma.PostSelect;
// }

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUser: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUser),
    },
    attachments: true,

    likes: {
      where: {
        userId: loggedInUser,
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

export type LikeInfo = {
  likes: number;
  isLikedByUser: boolean;
};
