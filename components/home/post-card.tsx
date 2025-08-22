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
  Edit,
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
  onPostDeleted: (postId: string) => void;
  onEdit: (postId: string, newContent: string) => Promise<void>;
}

export function PostCard({ post, onPostDeleted, onEdit }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { setToastMessage } = useToastContext();

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const result = await toggleLike(post.id);
      console.log("result is ", result);
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
  };

  const handleDelete = async () => {
    try {
      onPostDeleted(post.id);
      await deletePost(post.id);
    } catch (error) {
      setToastMessage("Failed to delete post.");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim() === "") {
      setToastMessage("Post content cannot be empty.");
      return;
    }
    if (editedContent === post.content) {
      setIsEditing(false);
      return;
    }
    onEdit(post.id, editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(post.content);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const sanitizedDateString = dateString.replace(/\+00:00$/, "Z");
    const date = new Date(sanitizedDateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

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
              <DropdownMenuContent align="end" className=" rounded">
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 cursor-pointer px-3 py-2 text-sm text-foreground hover:bg-accent focus:bg-accent rounded-md transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive cursor-pointer transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="w-full resize-none bg-transparent p-2 border border-input rounded focus-visible:outline-none focus-visible:ring-0 text-sm"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              maxLength={280}
            />
          </div>
        ) : (
          <p className="text-sm mb-3 leading-relaxed text-foreground">
            {post.content}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
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

          {isEditing && (
            <div className="flex justify-end gap-2 mt-2">
              <Button
                onClick={handleCancelEdit}
                variant="ghost"
                className="px-4 py-2 text-sm rounded font-normal"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm rounded font-normal"
                disabled={editedContent.trim() === ""}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
