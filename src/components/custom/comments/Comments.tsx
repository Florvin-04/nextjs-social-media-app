import { CommentsPage, PostData } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import KyInstance from "@/lib/ky";
import Comment from "./Comment";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  post: PostData;
};

export default function Comments({ post }: Props) {
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        KyInstance.get(
          `/api/posts/${post.id}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        ).json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.prevCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (status === "pending") {
    return (
      <div className="flex h-[5rem] w-full items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <CommentInput post={post} />
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center">
          <Button className="" variant="link" onClick={() => fetchNextPage()}>
            View More Comments
          </Button>
        </div>
      )}
      {comments.length !== 0 ? (
        <div className="divide-y-2">
          {comments.map((comment) => {
            return <Comment key={comment.id} comment={comment} />;
          })}
        </div>
      ) : (
        <div className="flex h-[3rem] items-center justify-center">
          <p>No Comments Available</p>
        </div>
      )}
    </div>
  );
}
