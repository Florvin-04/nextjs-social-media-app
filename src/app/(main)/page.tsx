import PostEditor from "@/components/custom/posts/editor/PostEditor";
import Post from "@/components/custom/posts/Post";
import TrendSidebar from "@/components/custom/TrendSidebar";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {
  // const posts = await prisma.post.findMany({
  //   include: postDataInclude,
  //   orderBy: { createdAt: "desc" },
  // });

  return (
    <main className="flex w-full min-w-0 gap-3">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {/* {posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })} */}
        <ForYouFeed />
      </div>
      <TrendSidebar />
    </main>
  );
}
