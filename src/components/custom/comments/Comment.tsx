import { CommentData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";

type Props = {
  comment: CommentData;
};

export default function Comment({ comment }: Props) {
  return (
    <div className="py-3">
      <div className="flex gap-3">
        <div className="flex-none">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <UserAvatar avatarUrl={comment.user.avatarUrl!} />
            </Link>
          </UserTooltip>
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <UserTooltip user={comment.user}>
              <p className="w-full break-words text-sm font-medium">
                {comment.user.displayName}
              </p>
            </UserTooltip>
            <p className="text-sm text-muted-foreground">
              {formatRelativeDate(comment.createdAt)}
            </p>
          </div>
          <p className="break-words">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
