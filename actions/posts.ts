"use server";

import { createPostSchema } from "@/lib/schema/posts";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuthData } from "./server-auth";

export async function createPost(content: string) {
  try {
    console.log("In createPost.");
    const validatedData = createPostSchema.parse({ content });

    const supabase = await createClient();
    const { user, profile } = await getAuthData();

    if (!user) {
      return {
        success: false,
        message: "Authentication required",
      };
    }
    if (!profile) {
      return {
        success: false,
        message: "User profile not found",
      };
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        content: validatedData.content,
        author_id: user.id,
      })
      .select()
      .single();
    console.log("postError is ", postError);
    console.log("post is ", post);

    if (postError) {
      return {
        success: false,
        message: "Failed to create post",
      };
    }

    revalidatePath("/home");

    console.log("profile is ", profile);

    return {
      success: true,
      data: post,
      newPost: {
        ...post,
        author: { username: profile.username },
        isAuthor: true,
      },
    };
  } catch (error) {
    console.log("Create post error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid Content",
      };
    }

    return {
      success: false,
      message: "Internal Server Error.",
    };
  }
}

export async function getPosts(
  cursor?: string,
  query?: string,
  limit = 10,
  filter?: "all" | "me",
  userId?: string
) {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      author:profiles!posts_author_id_fkey!inner (
        id,
        username
      ),
      likes:likes(count)
      `
    )
    .order("created_at", { ascending: false });

  // Filter posts by user ID if the filter is set to "me"
  if (filter === "me" && userId) {
    queryBuilder = queryBuilder.eq("author_id", userId);
  }

  if (query && query.trim()) {
    queryBuilder = queryBuilder.or(`content.ilike.%${query}%`);
  }

  if (cursor) {
    const { data: cursorPost } = await supabase
      .from("posts")
      .select("created_at")
      .eq("id", cursor)
      .single();

    if (cursorPost) {
      queryBuilder = queryBuilder.lt("created_at", cursorPost.created_at);
    }
  }

  const { data: postsData, error } = await queryBuilder.limit(limit + 1);

  if (error) {
    console.log("error.message is ", error.message);
    return {
      success: false,
      message: "Failed to Fetch Posts.",
    };
  }

  const hasMore = postsData.length > limit;
  const posts = hasMore ? postsData.slice(0, -1) : postsData;
  const nextCursor = hasMore ? posts[posts.length - 1]?.id || null : null;

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  let likedPostIds = new Set();
  if (currentUser) {
    const { data: likesData } = await supabase
      .from("likes")
      .select("post_id")
      .in(
        "post_id",
        posts.map((post) => post.id)
      )
      .eq("user_id", currentUser.id);

    if (likesData) {
      likedPostIds = new Set(likesData.map((like) => like.post_id));
    }
  }

  const formattedPosts = posts.map((post) => {
    const authorData = Array.isArray(post.author)
      ? post.author[0]
      : post.author;

    return {
      id: post.id,
      content: post.content,
      author: {
        id: authorData?.id,
        username: authorData?.username,
      },
      createdAt: post.created_at,
      likes: post.likes?.[0]?.count || 0,
      isAuthor: authorData?.id === currentUser?.id,
      isLiked: likedPostIds.has(post.id),
    };
  });

  return {
    posts: formattedPosts,
    nextCursor,
    hasMore,
  };
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { user, profile } = await getAuthData();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  // Attempt to delete the like first. This is an idempotent operation,
  // meaning it can be run multiple times without causing errors.
  const { count, error: deleteError } = await supabase
    .from("likes")
    .delete({ count: "exact" })
    .eq("user_id", profile.id)
    .eq("post_id", postId);

  if (deleteError) {
    console.log("Delete error:", deleteError.message);
    return {
      success: false,
      message: "Failed to unlike post",
    };
  }

  let isLiked = false;

  // If `count` is 0, it means the like did not exist and was not deleted.
  // We can now safely insert a new like.
  if (count === 0) {
    const { error: insertError } = await supabase.from("likes").insert({
      user_id: profile.id,
      post_id: postId,
    });

    if (insertError) {
      console.log("Insert error:", insertError.message);
      return {
        success: false,
        message: "Failed to like post",
      };
    }
    isLiked = true;
  }

  // If count > 0, the like was successfully deleted, so isLiked remains false.
  const { data: likesData, error: fetchError } = await supabase
    .from("likes")
    .select("post_id")
    .eq("post_id", postId);

  if (fetchError) {
    console.log("Fetch likes error:", fetchError.message);
    return {
      success: false,
      message: "Failed to retrieve like count",
    };
  }

  return {
    likes: likesData?.length || 0,
    isLiked: isLiked,
  };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) {
    console.log("error.message is ", error.message);
    return {
      success: false,
      message: "Failed to delete post",
    };
  }
}
