import { validateRequest } from "@/auth";
import Linkify from "@/components/custom/LinkifyText";
import Post from "@/components/custom/posts/Post";
import UserAvatar from "@/components/custom/UserAvatar";
import UserTooltip from "@/components/custom/UserTooltip";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

type PageProps = {
  params: {
    postId: string;
  };
};

const getPost = cache(
  async ({
    loggedInUserId,
    postId,
  }: {
    loggedInUserId: string;
    postId: string;
  }) => {
    const posts = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: getPostDataInclude(loggedInUserId),
    });

    if (!posts) notFound();

    return posts;
  },
);

export async function generateMetadata({
  params: { postId },
}: PageProps): Promise<Metadata> {
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost({ postId, loggedInUserId: user.id });

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function PostPage({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) {
    return <p className="text-destructive">Unauthorized User</p>;
  }

  const post = await getPost({ postId, loggedInUserId: user.id });

  return (
    <div className="relative min-w-0 flex-1">
      <div className="flex min-w-0 gap-2">
        <div className="min-w-0 flex-1">
          <Post post={post} />
        </div>

        <div className="w-72">
          <Suspense
            fallback={
              <div className="flex h-[10rem] items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            <UserSidebar user={post.user} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

type UserSidebarProps = {
  user: UserData;
};

async function UserSidebar({ user }: UserSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (!loggedInUser) return null;

  return (
    <div className="sticky top-[4.3rem] h-fit w-full -translate-y-[1rem] space-y-4 rounded-ee-2xl rounded-es-2xl bg-card px-4 py-3">
      <p className="text-2xl font-bold">About this user</p>
      <UserTooltip user={user}>
        <div className="flex gap-2">
          <UserAvatar avatarUrl={user.avatarUrl!} />
          <div>
            <p className="line-clamp-1 break-all font-semibold">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-sm text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </div>
      </UserTooltip>
      <Linkify>
        <div className="whitespace-pre-line break-words">{user.bio}</div>
      </Linkify>
    </div>
  );
}
