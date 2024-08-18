import { validateRequest } from "@/auth";
import Post from "@/components/custom/posts/Post";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

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

export async function generateMetaData({
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
    <div className="min-w-0 flex-1 relative">
      <div className="flex min-w-0 gap-2">
        <div className="min-w-0 flex-1">
          <Post post={post} />
        </div>
        <UserSidebar user={post.user} />
      </div>
    </div>
  );
}

type UserSidebarProps = {
  user: UserData;
};

async function UserSidebar({ user }: UserSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <div className="h-fit -translate-y-[1rem] sticky top-[4.3rem] rounded-ee-2xl rounded-es-2xl bg-card px-4 py-3">
      {user.displayName}
    </div>
  );
}
