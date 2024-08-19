import TrendSidebar from "@/components/custom/TrendSidebar";
import Bookmarks from "./Bookmarks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <div className="flex w-full min-w-0 gap-2">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex h-[5rem] items-center justify-center rounded-2xl bg-card">
          <p className="text-bold text-2xl">Bookmarks</p>
        </div>
        <Bookmarks />
      </div>
      <TrendSidebar />
    </div>
  );
}
