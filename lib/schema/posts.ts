import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(280, "Post content cannot exceed 280 characters")
    .trim(),
});
