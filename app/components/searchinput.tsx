"use client";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useState } from "react";

const SearchInput = ({
  div,
  input,
  searchValue,
}: {
  div: string;
  input: string;
  searchValue?: string | null;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(searchValue ? searchValue : "");
  const handleSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (query === "") return;
      router.push(`/search?q=${query}`);
    }
  };
  return (
    <>
      <div className={cn("p-6 rounded-lg", div)}>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchChange}
            placeholder="Search for courses"
            className={cn(
              "w-full pl-12 pr-4 py-2 rounded-md bg-gray-100 text-foreground",
              input
            )}
          />
        </div>
      </div>
    </>
  );
};

export default SearchInput;
