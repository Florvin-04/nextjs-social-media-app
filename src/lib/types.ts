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

    bookmarks: {
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
        comments: true,
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

export function getCommentDataInclude(loggedInUser: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUser),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export type CommentsPage = {
  comments: CommentData[];
  prevCursor: string | null;
};

export type FollowerInfo = {
  followers: number;
  isFollowedByUser: boolean;
};

export type LikeInfo = {
  likes: number;
  isLikedByUser: boolean;
};

export type BookmarkInfo = {
  isBookmarkedByUser: boolean;
};
