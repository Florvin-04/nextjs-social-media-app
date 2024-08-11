import { validateRequest } from "@/auth";
import FollowButton from "@/components/custom/FollowButton";
import FollowerCount from "@/components/custom/FollowerCount";
import TrendSidebar from "@/components/custom/TrendSidebar";
import UserAvatar from "@/components/custom/UserAvatar";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import EditProfileButton from "./EditProfileButton";
import Linkify from "@/components/custom/LinkifyText";

type UserPageProps = {
  params: {
    username: string;
  };
};

export const getUser = cache(
  async ({
    loggedInUserId,
    username,
  }: {
    username: string;
    loggedInUserId: string;
  }) => {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUserId),
    });
    if (!user) notFound();

    return user;
  },
);

export async function generateMetaData({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser({ username, loggedInUserId: loggedInUser.id });

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function UserPage({
  params: { username },
}: UserPageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <div>
        <p>You are not authorized to view this page</p>
      </div>
    );
  }

  const user = await getUser({ username, loggedInUserId: loggedInUser.id });

  return (
    <div className="flex w-full min-w-0">
      <div className="min-w-0 flex-1 space-y-3">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />

        <div className="rounded-2xl bg-card py-5 text-center">
          <p className="text-xl font-bold">{user.displayName}'s Posts</p>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendSidebar />
    </div>
  );
}

type UserProfileProps = {
  user: UserData;
  loggedInUserId: string;
};

async function UserProfile({ loggedInUserId, user }: UserProfileProps) {
  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      (follower) => follower.followerId === loggedInUserId,
    ),
  };

  return (
    <div className="rounded-2xl bg-card p-5">
      <UserAvatar
        className="mx-auto aspect-square size-full max-w-60"
        size={250}
        avatarUrl={user.avatarUrl!}
      />
      <div className="space-y-3">
        <div className="flex flex-wrap justify-between">
          <div className="">
            <p className="text-3xl font-bold">{user.displayName}</p>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <div>
            {user.id === loggedInUserId ? (
              <EditProfileButton user={user} />
            ) : (
              <FollowButton initalState={followerState} userId={user.id} />
            )}
          </div>
        </div>
        <p>Member since {formatDate(user.createdAt, "MM d, yyyy")}</p>
        <div className="flex gap-3">
          <p>
            Post: <span className="font-semibold">{user._count.posts}</span>
          </p>
          <p>
            <span>Followers: </span>
            <FollowerCount initalState={followerState} userId={user.id} />
          </p>
        </div>

        {user.bio && (
          <Linkify>
            <div className="border-t-2 border-border">
              <p className="mt-2 whitespace-pre-line">{user.bio}</p>
            </div>
          </Linkify>
        )}
      </div>
    </div>
  );
}
