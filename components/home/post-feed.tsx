"use client";

import { getPosts } from "@/actions/posts";
import { Card } from "@/components/ui/card";
import { Post } from "@/interfaces/post";
import { User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToastContext } from "../providers/toast";
import { Skeleton } from "../ui/skeleton";
import { PostCard } from "./post-card";

interface PostFeedProps {
  initialPosts: Post[];
  initialCursor: string | null;
  initialHasMore: boolean;
  searchQuery?: string;
}

export function PostFeed({
  initialPosts,
  initialCursor,
  initialHasMore,
  searchQuery = "",
}: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchQuery);

  const observerRef = useRef<IntersectionObserver>(null);
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { setToastMessage } = useToastContext();

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await getPosts(cursor || undefined, query);
      if (response.posts && response.hasMore) {
        setPosts((prev) => [...prev, ...response.posts]);
        setCursor(response.nextCursor);
        setHasMore(response.hasMore);
      }
      if (response.message) {
        setToastMessage(response.message);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading, query, setToastMessage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMorePosts, hasMore, isLoading]);

  // Handle search query changes
  useEffect(() => {
    if (query !== searchQuery) {
      setQuery(searchQuery);
      // Reset and reload posts with new query
      setPosts(initialPosts);
      setCursor(initialCursor);
      setHasMore(initialHasMore);
    }
  }, [searchQuery, initialPosts, initialCursor, initialHasMore, query]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const PostSkeleton = () => (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-6 pt-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostCard post={post} onPostDeleted={handlePostDeleted} />
        </div>
      ))}

      {isLoading && (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You&apos;ve reached the end!</p>
        </div>
      )}

      {posts.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No posts found.</p>
          {query && <p className="text-sm">Try adjusting your search.</p>}
        </div>
      )}
    </div>
  );
}
