"use client";
import { getPosts } from "@/actions/posts";
import { getAuthData } from "@/actions/server-auth";
import CreateNewPost from "@/components/home/create-new-post";
import { Navbar } from "@/components/home/navbar";
import { PostFeed } from "@/components/home/post-feed";
import PostSkeleton from "@/components/home/post-skeleton";
import { SearchBar } from "@/components/home/search-bar";
import { useToastContext } from "@/components/providers/toast";
import { Post } from "@/interfaces/post";
import type { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<"all" | "me">("all");
  const { setToastMessage } = useToastContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchInitialDataAndAuth = async () => {
      setIsLoadingInitial(true);

      const queryParam = searchParams.get("query") || "";
      const filterParam = (searchParams.get("filter") || "all") as "all" | "me";

      setCurrentQuery(queryParam);
      setCurrentFilter(filterParam);

      try {
        const initialData = await getPosts(
          undefined,
          queryParam,
          10,
          filterParam
        );
        if (initialData.posts) {
          setPosts(initialData.posts);
          setCursor(initialData.nextCursor);
          setHasMore(initialData.hasMore);
        } else {
          setToastMessage(
            initialData.message || "Failed to fetch initial posts."
          );
        }
      } catch (error) {
        setToastMessage("Failed to fetch initial posts.");
        console.error("Error fetching initial posts:", error);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    fetchInitialDataAndAuth();
  }, [searchParams, router, setToastMessage]);

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await getPosts(cursor, currentQuery, 10, currentFilter);
      if (response.posts) {
        setPosts((prev) => [...prev, ...response.posts]);
        setCursor(response.nextCursor);
        setHasMore(response.hasMore);
      }
      if (response.message) {
        setToastMessage(response.message);
      }
    } catch (error) {
      setToastMessage("Failed to load more posts.");
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    cursor,
    hasMore,
    isLoadingMore,
    currentQuery,
    currentFilter,
    setToastMessage,
  ]);

  const handlePostCreated = useCallback((newPost: Post) => {
    console.log("newPost is ", newPost);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen relative flex flex-col px-4 items-center justify-center">
        <div className="max-w-2xl w-full mx-auto mt-4 space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col px-4">
      {/* <Navbar user={user} /> */}
      <div className="max-w-2xl w-full mx-auto mt-4 flex flex-col gap-4 flex-1">
        <CreateNewPost onPostCreated={handlePostCreated} />
        <SearchBar initialQuery={currentQuery} initialFilter={currentFilter} />
        {posts ? (
          <PostFeed
            posts={posts}
            loadMorePosts={loadMorePosts}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            query={currentQuery}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              Failed to Fetch Posts. Please Try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
