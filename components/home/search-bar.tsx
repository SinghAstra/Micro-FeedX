"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set("query", searchQuery.trim());
      }
      const queryString = params.toString();
      router.push(`/home${queryString ? `?${queryString}` : ""}`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isPending}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            disabled={isPending}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
