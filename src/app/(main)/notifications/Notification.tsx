import UserAvatar from "@/components/custom/UserAvatar";
import { NotificationData } from "@/lib/types";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";

type Props = {
  notification: NotificationData;
};

export default function Notification({ notification }: Props) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    COMMENT: {
      message: `commented on you posts`,
      icon: <MessageCircle className="size-7 text-primary" />,
      href: `/users/${notification.postId}`,
    },
    FOLLOW: {
      message: `followed you`,
      icon: <User2 className="size-7 fill-primary text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    LIKE: {
      message: `liked your comment`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/users/${notification.issuer.username}`,
    },
  };

  const { message, href, icon } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block min-w-0">
      <article className="flex w-full min-w-0 items-start gap-3 rounded-2xl bg-card px-4 py-3">
        <div className="my2-1">{icon}</div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <UserAvatar avatarUrl={notification.issuer.avatarUrl!} />
          </div>
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span className="text-muted-foreground">{message}</span>
          </div>
          {notification.post && (
            <div className="w-full min-w-0">
              <p className="break-words">{notification.post.content}</p>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
