"use client";

import { deletePost, toggleLike } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "@/interfaces/post";
import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useToastContext } from "../providers/toast";

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

export function PostCard({ post, onPostDeleted }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setToastMessage } = useToastContext();

  const handleLike = async () => {
    // Optimistic update
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsPending(true);

    try {
      const result = await toggleLike(post.id);
      if (result.likes && result.isLiked) {
        setLikes(result.likes);
        setIsLiked(result.isLiked);
      }
      if (result.message) {
        setToastMessage(result.message);
      }
    } catch (error) {
      setIsLiked(isLiked);
      setLikes(likes);
      setToastMessage("Failed to toggle like.");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
    }
    setIsPending(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deletePost(post.id);
      onPostDeleted?.(post.id);
    } catch (error) {
      setIsDeleting(false);
      setToastMessage("Failed to delete post.");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
    }
    setIsDeleting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  if (isDeleting) {
    return (
      <div className="flex items-start gap-3 p-4 border rounded opacity-50">
        <div className="text-center text-muted-foreground">
          Deleting post...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 border rounded">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              @{post.author.username}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">
              {formatDate(post.createdAt)}
            </span>
          </div>
          {post.isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-sm mb-3 leading-relaxed">{post.content}</p>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isPending}
            className={cn(
              "h-8 px-2 gap-2 text-muted-foreground hover:text-red-500",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            <span className="text-xs">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 gap-2 text-muted-foreground hover:text-blue-500"
            disabled={true}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">Reply</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={true}
            className="h-8 px-2 gap-2 text-muted-foreground hover:text-green-500"
          >
            <Share className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
