"use client";

import { createPost } from "@/actions/posts";
import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/interfaces/post";
import { cn } from "@/lib/utils";
import type React from "react";
import { useRef, useState } from "react";

interface CreateNewPostProps {
  onPostCreated: (newPost: Post) => void;
}

function CreateNewPost({ onPostCreated }: CreateNewPostProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setToastMessage } = useToastContext();
  const MAX_CHARS = 280;
  const remainingChars = MAX_CHARS - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await createPost(content.trim());
      if (result.success && result.newPost) {
        setContent("");
        onPostCreated(result.newPost);
      }
      if (result.message) {
        setToastMessage(result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setToastMessage(error.message);
      } else {
        setToastMessage("Failed to create post.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border py-2 px-4 bg-muted/30 rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold ">What&apos;s on your mind?</p>
        <div className="flex gap-4 items-center">
          <span
            className={cn(
              "text-sm font-medium",
              isOverLimit
                ? "text-destructive"
                : isNearLimit
                ? "text-orange-500"
                : "text-muted-foreground"
            )}
          >
            {remainingChars}
          </span>
          <Button
            type="submit"
            disabled={!content.trim() || isOverLimit || isSubmitting}
            className="rounded-md px-6 py-2 transition-colors duration-200 ease-in-out"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none border-0 p-2 text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        maxLength={MAX_CHARS + 50}
      />
    </form>
  );
}

export default CreateNewPost;
