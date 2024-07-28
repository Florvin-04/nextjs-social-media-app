"use client";

import React from "react";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchField = () => {
  const router = useRouter();

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const query = (form.q as HTMLInputElement).value.trim();

    if (!query) return;

    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmitForm} method="GET" action="/search">
      <div className="relative">
        <Input
          className="pe-[2.5rem] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="search"
          name="q"
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2" />
      </div>
    </form>
  );
};

export default SearchField;
