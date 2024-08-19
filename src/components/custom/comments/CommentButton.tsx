"use client";

import KyInstance from "@/lib/ky";
import { CommentsInfo, PostData } from "@/lib/types";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";

type Props = {
  post: PostData;
  initalState: CommentsInfo;
  onClick: () => void;
};

export default function CommentButton({ initalState, post, onClick }: Props) {
  const queryKey: QueryKey = ["comment-info", post.id];
  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      KyInstance.get(
        `/api/posts/${post.id}/comments-info`,
      ).json<CommentsInfo>(),
    initialData: initalState,
    staleTime: Infinity,
  });
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm tabular-nums">
        Comments {data.comments}
      </span>
    </button>
  );
}
