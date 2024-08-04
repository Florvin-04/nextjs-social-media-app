"use client";

import InfiniteScrollContainer from "@/components/custom/InfiniteScrollContainer";
import Post from "@/components/custom/posts/Post";
import KyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const FollowingFeed = () => {
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) => {
      return KyInstance.get(
        "/api/posts/following",
        pageParam ? { searchParams: { cursor: pageParam } } : {},
      ).json<PostPage>();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "pending") {
    return (
      <div className="flex h-[10rem] w-full items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    return <div className="text-center text-destructive">error</div>;
  }

  const posts = data.pages.flatMap((page) => page.posts) || [];

  if (posts.length === 0) {
    return (
      <div className="text-center">
        No Post Available. Start Follwing Someone
      </div>
    );
  }

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

export default FollowingFeed;
