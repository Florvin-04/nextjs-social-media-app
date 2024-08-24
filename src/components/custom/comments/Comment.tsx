"use client";

import { CommentData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import CommentMenuButton from "./CommentMenuButton";
import { useSession } from "@/app/(main)/SessionProvider";

type Props = {
  comment: CommentData;
};

export default function Comment({ comment }: Props) {
  const { user } = useSession();

  return (
    <div className="group/comment py-3">
      <div className="flex gap-3">
        <div className="flex-none">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <UserAvatar avatarUrl={comment.user.avatarUrl!} />
            </Link>
          </UserTooltip>
        </div>
        <div className="w-full min-w-0">
          <div className="flex w-full">
            <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
              <UserTooltip user={comment.user}>
                <p className="w-full break-words text-sm font-medium">
                  {comment.user.displayName}
                </p>
              </UserTooltip>
              <p className="text-sm text-muted-foreground">
                {formatRelativeDate(comment.createdAt)}
              </p>
            </div>

            {user.id === comment.userId && (
              <CommentMenuButton
                className="opacity-0 transition-all group-hover/comment:opacity-100"
                comment={comment}
              />
            )}
          </div>
          <p className="break-words">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
