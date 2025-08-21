"use client";

import { createPost } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type React from "react";
import { useRef, useState } from "react";
import { useToastContext } from "../providers/toast";

interface CreateNewPostProps {
  onPostCreated?: () => void;
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
      if (result.success) {
        setContent("");
        onPostCreated?.();
      }
      if (result.message) {
        setToastMessage(result.message);
      }
    } catch (error) {
      console.log("Error creating post.");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border py-2 px-4 bg-muted/30"
    >
      <div className="flex justify-between items-center">
        <p>What&apos;s up ?</p>
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
            className="rounded"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none border-0 p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
        maxLength={MAX_CHARS + 50}
      />
    </form>
  );
}

export default CreateNewPost;
