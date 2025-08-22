// PostFeed.tsx
"use client";

import { getPosts } from "@/actions/posts";
import { PostCard } from "@/components/home/post-card"; // Corrected alias import
import PostSkeleton from "@/components/home/post-skeleton"; // Corrected alias import
import { useToastContext } from "@/components/providers/toast";
import { Post } from "@/interfaces/post";
import { User as UserIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface PostFeedProps {
  posts: Post[];
  loadMorePosts: () => Promise<void>;
  hasMore: boolean;
  isLoadingMore: boolean;
  query: string;
}

export function PostFeed({
  posts,
  loadMorePosts,
  hasMore,
  isLoadingMore,
  query,
}: PostFeedProps) {
  console.log("posts.length is ", posts.length);

  const lastPostRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMorePosts, hasMore, isLoadingMore]);

  return (
    <div className="space-y-4">
      {posts.length === 0 && !isLoadingMore && (
        <div className="text-center py-12 text-muted-foreground">
          <UserIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No posts found.</p>
          {query && <p className="text-sm">Try adjusting your search.</p>}
        </div>
      )}

      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostCard post={post} />
        </div>
      ))}

      {isLoadingMore && (
        <div className="space-y-4 py-8">
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
    </div>
  );
}
