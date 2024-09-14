"use client";

import MessagesButtonNotification from "@/app/(main)/messages/MessagesButtonNotification";
import NotificationButton from "@/app/(main)/notifications/NotificationButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuBarItem = [
  { name: "Home", path: "/", icon: <Home /> },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <Bell />,
    notification: true,
  },
  { name: "Messages", path: "/messages", icon: <Mail />, notification: true },
  { name: "Bookmarks", path: "/bookmarks", icon: <Bookmark /> },
];

export default function MenuList() {
  const path = usePathname();

  return (
    <>
      {menuBarItem.map((item) => {
        return (
          <Link
            title={item.name}
            href={item.path}
            key={`menubar-nav-key${item.name}`}
            className={cn("", path === item.path && "rounded-md bg-accent/50")}
          >
            {item.name === "Notifications" && (
              <NotificationButton name={item.name} icon={item.icon} />
            )}

            {item.name === "Messages" && (
              <MessagesButtonNotification name={item.name} icon={item.icon} />
            )}

            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start",
                item.notification && "hidden",
              )}
              icon={item.icon}
            >
              <span className="hidden lg:inline">{item.name}</span>
            </Button>
          </Link>
        );
      })}
    </>
  );
}
