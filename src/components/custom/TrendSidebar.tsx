import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import Link from "next/link";
import React, { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";

const TrendSidebar = async () => {
  return (
    <div className="mb sticky top-[4.3rem] hidden h-fit w-72 flex-none space-y-5 rounded-md px-5 py-3 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendSidebar;

const WhoToFollow = async () => {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-3 rounded-2xl bg-card px-3 py-3">
      <p className="text-xl font-bold"> Who to follow</p>
      {usersToFollow.map((userToFollow) => {
        return (
          <div
            key={userToFollow.id}
            className="flex items-center justify-between gap-3"
          >
            <Link
              href={`/users/${userToFollow.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={userToFollow.avatarUrl!} />
              <div className="min-w-0">
                <p className="line-clamp-1 break-all hover:underline">
                  {userToFollow.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground hover:underline">
                  @{userToFollow.username}
                </p>
              </div>
            </Link>

            <FollowButton
              userId={userToFollow.id}
              initalState={{
                followers: userToFollow._count.followers,
                isFollowedByUser: userToFollow.followers.some(
                  (follower) => follower.followerId === user.id,
                ),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) as hashtag, COUNT(*) as count
    FROM posts 
    GROUP BY (hashtag)
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
  `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 3 * 60 * 60 }, // 3 hours validation
);

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics();

  console.log(trendingTopics);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-3">
      <p className="text-xl font-bold">Trending Topics</p>

      {trendingTopics.map(({ count, hashtag }) => {
        const title = hashtag.split("#")[1];
        return (
          <Link key={title} href={`/hastag/${title}`}>
            <p className="font-bold hover:underline">{hashtag}</p>
            <p className="text-sm text-muted-foreground hover:underline">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
