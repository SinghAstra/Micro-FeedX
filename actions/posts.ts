"use server";

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
