"use client";

import { getPosts } from "@/actions/posts";
import { Post } from "@/interfaces/post";
import { User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToastContext } from "../providers/toast";
import { PostCard } from "./post-card";
import PostSkeleton from "./post-skeleton";

interface PostFeedProps {
  posts: Post[];
}

export function PostFeed({ posts }: PostFeedProps) {
  console.log("posts.length is ", posts.length);

  // const observerRef = useRef<IntersectionObserver>(null);
  const lastPostRef = useRef<HTMLDivElement>(null);

  // const loadMorePosts = useCallback(async () => {
  //   if (isLoading || !hasMore) return;

  //   setIsLoading(true);
  //   try {
  //     const response = await getPosts(cursor || undefined, query);
  //     if (response.posts && response.hasMore) {
  //       setPosts((prev) => [...prev, ...response.posts]);
  //       setCursor(response.nextCursor);
  //       setHasMore(response.hasMore);
  //     }
  //     if (response.message) {
  //       setToastMessage(response.message);
  //     }
  //   } catch (error) {
  //     setToastMessage("Failed to load more posts.");
  //     if (error instanceof Error) {
  //       console.log("error.stack is ", error.stack);
  //       console.log("error.message is ", error.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [cursor, hasMore, isLoading, query, setToastMessage]);

  // useEffect(() => {
  //   if (observerRef.current) observerRef.current.disconnect();

  //   observerRef.current = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore && !isLoading) {
  //         loadMorePosts();
  //       }
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (lastPostRef.current) {
  //     observerRef.current.observe(lastPostRef.current);
  //   }

  //   return () => {
  //     if (observerRef.current) {
  //       observerRef.current.disconnect();
  //     }
  //   };
  // }, [loadMorePosts, hasMore, isLoading]);

  // useEffect(() => {
  //   if (query !== searchQuery) {
  //     setQuery(searchQuery);
  //     setPosts(initialPosts);
  //     setCursor(initialCursor);
  //     setHasMore(initialHasMore);
  //   }
  // }, [searchQuery, initialPosts, initialCursor, initialHasMore, query]);

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostCard post={post} />
        </div>
      ))}

      {/* {isLoading && (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )} */}

      {/* {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You&apos;ve reached the end!</p>
        </div>
      )} */}
      {/* 
      {posts.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No posts found.</p>
          {query && <p className="text-sm">Try adjusting your search.</p>}
        </div>
      )} */}
    </div>
  );
}
