"use client";

import InfiniteScrollContainer from "@/components/custom/InfiniteScrollContainer";
import KyInstance from "@/lib/ky";
import { NotificationCountInfo, NotificationsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Notification from "./Notification";
import { useEffect } from "react";

export default function Notifications() {
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: ({ pageParam }) => {
      return KyInstance.get(
        "/api/notifications",
        pageParam ? { searchParams: { cursor: pageParam } } : {},
      ).json<NotificationsPage>();
    },

    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => KyInstance.patch("/api/notifications/marked-as-read"),
    onSuccess: () => {
      queryClient.setQueryData<NotificationCountInfo>(
        ["unread-notification-count"],
        (): NotificationCountInfo => {
          return {
            unreadCount: 0,
          };
        },
      );
    },

    onError: (error) => {
      console.error("notifications error", error);
    },
  });

  useEffect(() => {
    if (status === "success") {
      mutate();
    }
  }, [status]);

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

  const notifications =
    data.pages
      .flatMap((page) => page.notifications)
      .filter((a) => a !== undefined) || [];

  if (notifications.length === 0) {
    return <div className="text-center">No Bookmarks Available</div>;
  }

  return (
    <InfiniteScrollContainer
      isFetchingNextPage={isFetchingNextPage}
      onBottonReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      <div className="flex h-[5rem] items-center justify-center rounded-2xl bg-card text-2xl font-bold">
        Notifications
      </div>

      {notifications.map((notification) => {
        return (
          <Notification key={notification.id} notification={notification} />
        );
      })}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
