"use client";
import { getPosts } from "@/actions/posts";
import CreateNewPost from "@/components/home/create-new-post";
import { PostFeed } from "@/components/home/post-feed";
import { SearchBar } from "@/components/home/search-bar";
import { useToastContext } from "@/components/providers/toast";
import { Post } from "@/interfaces/post";
import React, { useCallback, useEffect, useState } from "react";

interface HomeClientPageProps {
  initialPosts: Post[];
  initialCursor?: string;
  initialHasMore: boolean;
  initialQuery: string;
  initialFilter: "all" | "me";
  initialMessage?: string;
}

const HomeClientPage = ({
  initialPosts,
  initialCursor,
  initialHasMore,
  initialQuery,
  initialFilter,
  initialMessage,
}: HomeClientPageProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentQuery] = useState(initialQuery);
  const [currentFilter] = useState<"all" | "me">(initialFilter);

  const { setToastMessage } = useToastContext();

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
      console.log("Error loading more posts.");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
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

  useEffect(() => {
    if (!initialMessage) return;
    setToastMessage(initialMessage);
  }, [setToastMessage, initialMessage]);

  return (
    <div className="max-w-2xl w-full mx-auto mt-4 flex flex-col gap-4 flex-1">
      <CreateNewPost onPostCreated={handlePostCreated} />
      <SearchBar initialQuery={currentQuery} initialFilter={currentFilter} />
      <PostFeed
        posts={posts}
        loadMorePosts={loadMorePosts}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        query={currentQuery}
      />
    </div>
  );
};

export default HomeClientPage;
