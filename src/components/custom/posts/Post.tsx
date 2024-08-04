import { PostData, PostPage } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";
import { useQueryClient } from "@tanstack/react-query";
import { Hand } from "lucide-react";
import KyInstance from "@/lib/ky";

type Props = {
  post: PostData;
};

const Post = ({ post }: Props) => {
  const { user } = useSession();
  return (
    <article className="group/post rounded-2xl bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap gap-3">
          {/* <Link href={`/users/${post.user.username}`} className="">
            <UserAvatar avatarUrl={post.user.avatarUrl!} />
          </Link> */}
          <RenderPostLink post={post} />
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
        {user.id === post.userId && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-all group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};

export default Post;

export function RenderPostLink({ post }: Props) {
  "use client";

  const queryClient = useQueryClient();

  const handleOnMouseEnter = () => {
    const query = queryClient.getQueriesData({
      queryKey: ["post-feed"],
    });

    const allKey = query.map((everyKey) => everyKey[0]);

    const containsArray = allKey.some(
      (subArray) =>
        JSON.stringify(subArray) ===
        JSON.stringify(["post-feed", "user-posts", post.user.id]),
    );

    console.log(containsArray);

    if (containsArray) return;

    queryClient.prefetchInfiniteQuery({
      queryKey: ["post-feed", "user-posts", post.user.id],
      queryFn: () => {
        return KyInstance.get(
          `/api/users/${post.user.id}/posts`,
        ).json<PostPage>();
      },
      initialPageParam: null as string | null,
    });
  };

  return (
    <Link
      // onMouseEnter={handleOnMouseEnter}
      href={`/users/${post.user.username}`}
      className=""
    >
      <UserAvatar avatarUrl={post.user.avatarUrl!} />
    </Link>
  );
}
