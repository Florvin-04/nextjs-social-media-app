"use client";

import InfiniteScrollContainer from "@/components/custom/InfiniteScrollContainer";
import Post from "@/components/custom/posts/Post";
import KyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type Props = {
  query: string;
};

export default function SearchResults({ query }: Props) {
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "search", query],
    queryFn: ({ pageParam }) => {
      return KyInstance.get("/api/search", {
        searchParams: {
          query: query,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      }).json<PostPage>();
    },

    gcTime: 0,
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

  const searchResults =
    data.pages.flatMap((page) => page.posts).filter((a) => a !== undefined) ||
    [];

  if (searchResults.length === 0) {
    return <div className="text-center">No Search Result Available</div>;
  }

  return (
    <InfiniteScrollContainer
      isFetchingNextPage={isFetchingNextPage}
      onBottonReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {searchResults.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
