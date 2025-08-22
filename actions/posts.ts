"use server";

import { Post } from "@/interfaces/post";
import { createPostSchema } from "@/lib/schema/posts";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createPost(content: string) {
  try {
    console.log("In createPost.");
    const validatedData = createPostSchema.parse({ content });

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log("authError is ", authError);
    console.log("user is ", user);

    if (authError || !user) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    console.log("profileError is ", profileError);
    console.log("profile is ", profile);
    if (profileError || !profile) {
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

    return {
      success: true,
      data: post,
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

export async function getPosts(cursor?: string, query?: string, limit = 10) {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      author:users!posts_author_id_fkey (
        id,
        username,
        full_name
      ),
      likes:likes(count),
      user_likes:likes!inner(user_id)
    `
    )
    .order("created_at", { ascending: false });

  if (query && query.trim()) {
    queryBuilder = queryBuilder.or(
      `content.ilike.%${query}%,users.full_name.ilike.%${query}%,users.username.ilike.%${query}%`
    );
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

  const formattedPosts: Post[] = posts.map((post) => {
    const authorData = Array.isArray(post.author)
      ? post.author[0]
      : post.author;

    return {
      id: post.id,
      content: post.content,
      author: {
        id: authorData?.id,
        name: authorData?.full_name || authorData?.username,
        username: authorData?.username,
      },
      createdAt: post.created_at,
      likes: post.likes?.[0]?.count || 0,
      isLiked:
        post.user_likes?.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (like: any) => like.user_id === currentUser?.id
        ) || false,
      isAuthor: authorData?.id === currentUser?.id,
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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existingLike) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);

    if (error) {
      console.log("error.message is ", error.message);
      return {
        success: false,
        message: "Failed to unlike post",
      };
    }
  } else {
    const { error } = await supabase.from("likes").insert({
      user_id: user.id,
      post_id: postId,
    });

    if (error) {
      console.log("error.message is ", error.message);
      return {
        success: false,
        message: "Failed to like post",
      };
    }
  }

  const { data: likesData } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId);

  return {
    likes: likesData?.length || 0,
    isLiked: !existingLike,
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
