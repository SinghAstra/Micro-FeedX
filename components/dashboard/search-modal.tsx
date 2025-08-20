"use client";

import { searchImages } from "@/actions/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileIcon, FolderIcon, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

interface SearchResult {
  id: string;
  name: string;
  url: string;
  folder: {
    id: string;
    name: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    const searchResults = await searchImages(searchQuery);
    setResults(searchResults || []);
    setIsSearching(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Debounce search - search after user stops typing for 300ms
    const timeoutId = setTimeout(() => {
      handleSearch(newQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleResultClick = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Images</DialogTitle>
          <DialogDescription>
            Search for images by name across all your folders.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type to search images..."
            value={query}
            onChange={handleInputChange}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                No images found matching &apos;{query}&apos;
              </p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {results.map((image) => (
                <Link
                  key={image.id}
                  href={`/dashboard/${image.folder.id}`}
                  onClick={handleResultClick}
                >
                  <div className="hover:shadow-lg w-full h-32 transition-shadow cursor-pointer relative">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-200 hover:scale-105"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-muted/40 px-2 py-1">
                      <p>{image.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!hasSearched && (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                Start typing to search for images...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
