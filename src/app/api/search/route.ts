import { validateRequest } from "@/auth";
import { pageSizeInfiniteScroll } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const query = req.nextUrl.searchParams.get("query") || "";

    const searchQuery = query.split(" ").join(" & ");

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                contains: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                contains: searchQuery,
              },
            },
          },
        ],
      },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSizeInfiniteScroll + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      posts.length > pageSizeInfiniteScroll
        ? posts[pageSizeInfiniteScroll].id
        : null;

    const data: PostPage = {
      posts: posts.slice(0, pageSizeInfiniteScroll),
      nextCursor: nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
