"use client";

import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "./UserAvatar";
import { FollowerInfo, UserData } from "@/lib/types";
import FollowButton from "./FollowButton";
import Linkify from "./LinkifyText";
import FollowerCount from "./FollowerCount";

type Props = {
  user: UserData;
  alignment?: "center" | "end" | "start";
} & PropsWithChildren;

export default function UserTooltip({ children, user, alignment }: Props) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      (follower) => follower.followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          {children}
        </TooltipTrigger>
        <TooltipContent align={alignment!} className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar avatarUrl={user.avatarUrl!} />
            {user.id !== loggedInUser.id && (
              <FollowButton userId={user.id} initalState={followerState} />
            )}
          </div>
          <div>
            <p>{user.displayName}</p>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <div>
            <div>
              <span>Followers: </span>
              <FollowerCount initalState={followerState} userId={user.id} />
            </div>
            {user.bio && (
              <Linkify>
                <p className="line-clamp-4 whitespace-pre-line">{user.bio}</p>
              </Linkify>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
