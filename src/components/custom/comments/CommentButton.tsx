"use client";

import KyInstance from "@/lib/ky";
import { CommentsInfo, PostData } from "@/lib/types";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import CommentsModal from "./CommentsModal";
import { useState } from "react";

type Props = {
  post: PostData;
  initalState: CommentsInfo;
  inModal?: boolean;
};

export default function CommentButton({ initalState, post, inModal }: Props) {
  const [showCommentsModal, setShowCommentsModal] = useState(false);

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
    <>
      <button
        onClick={() => {
          if (inModal) return;
          setShowCommentsModal(true);
        }}
        className="flex items-center gap-2"
      >
        <MessageSquare className="size-5" />
        <span className="text-sm tabular-nums">Comments {data.comments}</span>
      </button>

      {showCommentsModal && (
        <CommentsModal
          post={post}
          closeModal={() => setShowCommentsModal(false)}
        />
      )}
    </>
  );
}
