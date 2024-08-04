import PostEditor from "@/components/custom/posts/editor/PostEditor";
import TrendSidebar from "@/components/custom/TrendSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";

export default async function Home() {
  return (
    <main className="flex w-full min-w-0 gap-3">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs className="" defaultValue="for-you">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="for-you">
              For You
            </TabsTrigger>
            <TabsTrigger className="w-full" value="following">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendSidebar />
    </main>
  );
}
