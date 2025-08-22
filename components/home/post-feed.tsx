"use client";

import { User as UserIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Post } from "../../interfaces/post";
import { PostCard } from "./post-card"; // Corrected import path
import PostSkeleton from "./post-skeleton"; // Corrected import path

interface PostFeedProps {
  posts: Post[];
  loadMorePosts: () => Promise<void>;
  hasMore: boolean;
  isLoadingMore: boolean;
  query: string;
  onPostDeleted: (postId: string) => void;
  onPostEdited: (postId: string, newContent: string) => Promise<void>;
}

export function PostFeed({
  posts,
  loadMorePosts,
  hasMore,
  isLoadingMore,
  query,
  onPostDeleted,
  onPostEdited,
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
          <PostCard
            post={post}
            onPostDeleted={onPostDeleted}
            onEdit={onPostEdited}
          />
        </div>
      ))}

      {isLoadingMore && <PostSkeleton />}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You&apos;ve reached the end!</p>
        </div>
      )}
    </div>
  );
}
