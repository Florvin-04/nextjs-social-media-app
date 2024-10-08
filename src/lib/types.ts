import { Prisma } from "@prisma/client";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";

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

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },

  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export type NotificationsPage = {
  notifications: NotificationData[];
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

export type NotificationCountInfo = {
  unreadCount: number;
};
export type MessagesNotifInfo = {
  unreadCount: number;
};

export type CommentsInfo = {
  comments: number;
};

export type BookmarkInfo = {
  isBookmarkedByUser: boolean;
};

export type ControllerType = ControllerRenderProps<FieldValues, string>;

export type FieldType = "text" | "textarea" | "select" | "customField";

type RenderCustomFieldParams = {
  field: ControllerType; // Assuming ControllerType is already defined
  additionalParam?: number; // Replace with actual parameter names and types
};

export type FormFieldProps = {
  control: Control;
  name: string;
  type: FieldType;
  children?: React.ReactNode;
  renderCustomField?: (params: RenderCustomFieldParams) => React.ReactNode;
} & FieldValues;

export type RenderInputType = {
  field: ControllerType;
  props: FormFieldProps;
};
