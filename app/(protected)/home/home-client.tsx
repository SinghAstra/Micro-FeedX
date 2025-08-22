"use client";
import { editPost, getPosts } from "@/actions/posts";
import CreateNewPost from "@/components/home/create-new-post";
import { Navbar } from "@/components/home/navbar";
import { PostFeed } from "@/components/home/post-feed";
import { SearchBar } from "@/components/home/search-bar";
import { useToastContext } from "@/components/providers/toast";
import { Post } from "@/interfaces/post";
import type { User } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useState } from "react";

interface HomeClientPageProps {
  user: User;
  initialPosts: Post[];
  initialCursor?: string;
  initialHasMore: boolean;
  initialQuery: string;
  initialFilter: "all" | "me";
  initialMessage?: string;
}

const HomeClientPage = ({
  user,
  initialPosts,
  initialCursor,
  initialHasMore,
  initialQuery,
  initialFilter,
  initialMessage,
}: HomeClientPageProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  console.log("posts.length is ", posts.length);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [currentFilter, setCurrentFilter] = useState<"all" | "me">(
    initialFilter
  );

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

  const handlePostEdited = useCallback(
    async (postId: string, newContent: string) => {
      const originalPosts = posts;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, content: newContent } : post
        )
      );

      try {
        const result = await editPost(postId, newContent);
        if (!result.success) {
          setPosts(originalPosts);
          setToastMessage(result.message || "Failed to edit post.");
        } else {
          setToastMessage(result.message || "Post updated successfully!");
        }
      } catch (error) {
        console.log("Error editing post:", error);
        setPosts(originalPosts);
        setToastMessage("Failed to edit post due to an unexpected error.");
      }
    },
    [posts, setToastMessage]
  );

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  useEffect(() => {
    setCurrentQuery(initialQuery);
    setCurrentFilter(initialFilter);
    setPosts(initialPosts);
    setCursor(initialCursor);
    setHasMore(initialHasMore);
  }, [
    initialQuery,
    initialFilter,
    initialPosts,
    initialCursor,
    initialHasMore,
  ]);

  useEffect(() => {
    if (!initialMessage) return;
    setToastMessage(initialMessage);
  }, [setToastMessage, initialMessage]);

  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar user={user} onPostCreated={handlePostCreated} />
      <div className="max-w-2xl w-full mx-auto mt-4 flex flex-col gap-4 flex-1 px-4">
        <CreateNewPost onPostCreated={handlePostCreated} />
        <SearchBar initialQuery={currentQuery} initialFilter={currentFilter} />
        <PostFeed
          posts={posts}
          loadMorePosts={loadMorePosts}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          query={currentQuery}
          onPostDeleted={handleDeletePost}
          onPostEdited={handlePostEdited}
        />
      </div>
    </div>
  );
};

export default HomeClientPage;
