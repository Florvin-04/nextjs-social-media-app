import { CommentsPage, PostData } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import KyInstance from "@/lib/ky";
import Comment from "./Comment";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "../InfiniteScrollContainer";
import CommentButton from "./CommentButton";
import { useEffect, useRef, useState } from "react";

type Props = {
  post: PostData;
  submitComment?: boolean;
  setSubmitComment?: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
};

export default function Comments({
  post,
  submitComment,
  setSubmitComment,
  containerRef,
}: Props) {
  const latestCommentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }) =>
      KyInstance.get(
        `/api/posts/${post.id}/comments`,
        pageParam ? { searchParams: { cursor: pageParam } } : {},
      ).json<CommentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.prevCursor,
    // select: (data) => ({
    //   pages: [...data.pages].reverse(),
    //   pageParams: [...data.pageParams].reverse(),
    // }),
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  useEffect(() => {
    if (latestCommentRef.current && submitComment && containerRef.current) {
      // latestCommentRef.current.scrollIntoView({ behavior: "smooth" });

      // This code scrolls the container to show the latest comment
      const yOffset = -200; // Adjust this value to fine-tune the scroll position
      const element = latestCommentRef.current; // The latest comment element
      const container = containerRef.current; // The scrollable container

      // Calculate the container's offset from the top of the page
      const containerOffsetTop = container.offsetTop || 0;

      // Calculate the position to scroll to:
      // element's position + offset - container's top position
      const topPos = element.offsetTop + yOffset - containerOffsetTop;

      // Smoothly scroll the container to the calculated position
      container.scrollTo({
        top: topPos,
        behavior: "smooth",
      });

      if (setSubmitComment) {
        setSubmitComment();
      }
    }
  }, [submitComment]);

  if (status === "pending") {
    return (
      <div className="flex h-[5rem] w-full items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  if (comments.length === 0) {
    return <div className="text-center">No Comments Available</div>;
  }

  return (
    <InfiniteScrollContainer
      isFetchingNextPage={isFetchingNextPage}
      onBottonReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="mb-3 mt-5">
        <CommentButton
          inModal
          initalState={{ comments: comments.length }}
          post={post}
        />
      </div>

      {comments.map((comment, index) => {
        return (
          <div ref={index === 0 ? latestCommentRef : null}>
            <Comment key={comment.id} comment={comment} />
          </div>
        );
      })}

      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
