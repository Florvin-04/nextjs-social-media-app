import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  className: string;
};

const Menubar = ({ className }: Props) => {
  const menuBarItem = [
    { name: "Home", path: "/", icon: <Home /> },
    { name: "Notifications", path: "/notifications", icon: <Bell /> },
    { name: "Messages", path: "/messages", icon: <Mail /> },
    { name: "Bookmarks", path: "/bookmarks", icon: <Bookmark /> },
  ];

  return (
    <div className={cn("bg-card", className)}>
      {menuBarItem.map((item) => {
        return (
          <Link
            href={item.path}
            key={`menubar-nav-key${item.name}`}
            className=""
          >
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start"
              icon={item.icon}
            >
              <span className="hidden lg:inline">{item.name}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default Menubar;
