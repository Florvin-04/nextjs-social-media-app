"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import {
  Check,
  icons,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { handleLogoutAction } from "@/app/(auth)/action";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  className?: string;
};

const UserProfileButton = ({ className }: Props) => {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();

  const themeMenu = [
    { label: "Dark", value: "dark", icon: <Moon className="mr-2 size-4" /> },
    { label: "Light", value: "light", icon: <Sun className="mr-2 size-4" /> },
    {
      label: "System Default",
      value: "system",
      icon: <Monitor className="mr-2 size-4" />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="h-fit rounded-full focus-visible:ring-offset-1"
      >
        <Button
          className={cn(
            "rouded-full m-0 p-0 hover:bg-transparent focus-visible:ring-0",
            className,
          )}
          variant="ghost"
          icon={<UserAvatar avatarUrl={user.avatarUrl!} size={40} />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuLabel>Username: {user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-[10rem]">
              {themeMenu.map((menu) => {
                return (
                  <DropdownMenuItem
                    key={`key-theme-${menu.label}`}
                    className="relative"
                    onClick={() => setTheme(menu.value)}
                  >
                    {menu.icon}
                    {menu.label}
                    {theme === menu.value && (
                      <Check className="absolute right-1 top-1/2 size-4 -translate-y-1/2" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            handleLogoutAction();
            queryClient.clear();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
