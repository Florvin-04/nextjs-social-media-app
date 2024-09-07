"use client";

import { Button } from "@/components/ui/button";
import KyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type Props = {
  icon: React.ReactNode;
  name: string;
};

export default function MessagesButtonNotification({ name, icon }: Props) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      KyInstance.get(
        "/api/messages/unread-count",
      ).json<NotificationCountInfo>(),
    initialData: {
      unreadCount: 0,
    },
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      asChild
      variant="ghost"
      className="w-full justify-start"
      icon={icon}
      enabledNotification={data.unreadCount > 0}
      notificationCount={data.unreadCount}
    >
      <span className="hidden lg:inline">{name}</span>
    </Button>
  );
}
