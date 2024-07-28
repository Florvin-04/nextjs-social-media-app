"use client";

import InfiniteScrollContainer from "@/components/custom/InfiniteScrollContainer";
import Post from "@/components/custom/posts/Post";
import { Button } from "@/components/ui/button";
import KyInstance from "@/lib/ky";
import { PostData, PostPage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const ForYouFeed = () => {
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      KyInstance.get(
        "/api/posts/for-you",
        pageParam ? { searchParams: { cursor: pageParam } } : {},
      ).json<PostPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (status === "error") {
    return <div className="text-center text-destructive">error</div>;
  }

  const posts = data.pages.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScrollContainer
      isFetchingNextPage={isFetchingNextPage}
      onBottonReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default ForYouFeed;
