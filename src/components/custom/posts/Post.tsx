"use client";

import { PostData, PostPage } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";
import { useQueryClient } from "@tanstack/react-query";
import KyInstance from "@/lib/ky";
import Linkify from "../LinkifyText";
import UserTooltip from "../UserTooltip";
import { Media } from "@prisma/client";
import Image from "next/image";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Comments from "../comments/Comments";

type Props = {
  post: PostData;
};

export default function Post({ post }: Props) {
  const { user } = useSession();

  const [showComment, setShowComment] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap gap-3">
          <RenderPostLink post={post} />
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>

            <Link
              href={`/posts/${post.id}`}
              className="text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
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
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <DisplayAttachments attachments={post.attachments} />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LikeButton
            postId={post.id}
            initalState={{
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
              likes: post._count.likes,
            }}
          />
          <CommentButton
            onClick={() => setShowComment(!showComment)}
            post={post}
          />
        </div>

        <BookmarkButton
          postId={post.id}
          initalState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComment && <Comments post={post} />}
    </article>
  );
}

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
    <UserTooltip user={post.user}>
      <Link
        // onMouseEnter={handleOnMouseEnter}
        href={`/users/${post.user.username}`}
        className=""
      >
        <UserAvatar avatarUrl={post.user.avatarUrl!} />
      </Link>
    </UserTooltip>
  );
}

type DisplayAttachmentsProps = {
  attachments: Media[];
};

function DisplayAttachments({ attachments }: DisplayAttachmentsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
      {attachments.map((attachment) => {
        return (
          <div key={attachment.id} className="h-full">
            <SingleAttachment attachment={attachment} />
          </div>
        );
      })}
    </div>
  );
}

type SingleAttachmentProps = {
  attachment: Media;
};

function SingleAttachment({ attachment }: SingleAttachmentProps) {
  if (attachment.type === "IMAGE") {
    return (
      <Image
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        alt="image attachment"
        src={attachment.url}
        className="max-h-[20rem]"
      />
    );
  }

  if (attachment.type === "VIDEO") {
    return (
      <div className="h-full">
        <video controls className="h-full">
          <source src={attachment.url} />
        </video>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported File</p>;
}

type CommentButtonProps = {
  post: PostData;
  onClick: () => void;
};

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm tabular-nums">
        Comments {post._count.comments}
      </span>
    </button>
  );
}
