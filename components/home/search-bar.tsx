"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchBarProps {
  initialQuery?: string;
  initialFilter?: "all" | "me";
}

const DEBOUNCE_DELAY = 500; // milliseconds

export function SearchBar({
  initialQuery = "",
  initialFilter = "all",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [postFilter, setPostFilter] = useState<"all" | "me">(initialFilter);
  const router = useRouter();

  useEffect(() => {
    // Check if the query and filter are the same as the initial state to prevent
    // an initial search on component mount.
    if (query === initialQuery && postFilter === initialFilter) {
      return;
    }

    // Set a timeout to run the search after the user stops typing or toggles the filter
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("query", query.trim());
      }
      // Only set the filter parameter if it's not "all" to keep the URL cleaner
      if (postFilter === "me") {
        params.set("filter", "me");
      }
      const queryString = params.toString();
      router.push(`/home${queryString ? `?${queryString}` : ""}`);
    }, DEBOUNCE_DELAY);

    // Clean up the timeout on every render to prevent multiple searches
    return () => clearTimeout(timeoutId);
  }, [query, router, initialQuery, postFilter, initialFilter]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative mb-6 flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-1 rounded-md border p-1">
        <Button
          onClick={() => setPostFilter("all")}
          variant={postFilter === "all" ? "default" : "ghost"}
          size="sm"
        >
          All
        </Button>
        <Button
          onClick={() => setPostFilter("me")}
          variant={postFilter === "me" ? "default" : "ghost"}
          size="sm"
        >
          Me
        </Button>
      </div>
    </div>
  );
}
