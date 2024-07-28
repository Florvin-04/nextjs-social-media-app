import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";

type Props = {
  post: PostData;
};

const Post = ({ post }: Props) => {
  return (
    <article className="rounded-2xl bg-card p-5">
      <div className="flex flex-wrap gap-3">
        <Link href={`/users/${post.user.username}`} className="">
          <UserAvatar avatarUrl={post.user.avatarUrl!} />
        </Link>
        <div>
          <Link
            href={`/users/${post.user.username}`}
            className="block font-medium hover:underline"
          >
            {post.user.username}
          </Link>
          <Link
            href={`/posts/${post.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            {formatRelativeDate(post.createdAt)}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};

export default Post;
