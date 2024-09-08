import TrendSidebar from "@/components/custom/TrendSidebar";
import { Metadata } from "next";
import SearchResults from "./SearchResults";

type Props = {
  searchParams: {
    query: string;
  };
};

export function generateMetadata({ searchParams: { query } }: Props): Metadata {
  return {
    title: `Search result for ${query}`,
  };
}

export default function SearchResultPage({ searchParams: { query } }: Props) {
  return (
    <div className="flex w-full min-w-0 gap-2">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex h-[5rem] items-center justify-center rounded-2xl bg-card">
          <p className="text-bold text-2xl">Search result</p>
        </div>
        <SearchResults query={query} />
      </div>
      <TrendSidebar />
    </div>
  );
}
