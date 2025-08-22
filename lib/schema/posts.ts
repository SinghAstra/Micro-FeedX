import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(280, "Post content cannot exceed 280 characters")
    .trim(),
});

export const editPostSchema = z.object({
  id: z.string().uuid(),
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(500, "Content cannot exceed 500 characters"),
});
