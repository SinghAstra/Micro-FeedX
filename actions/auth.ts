"use server";

import { loginSchema, registerSchema } from "@/lib/schema/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  console.log("In login.");
  const supabase = await createClient();

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { message: "Invalid Credentials" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("data is ", data);
  console.log("error is ", error);

  if (error) {
    return { message: error.message };
  }

  redirect("/home");
}

export async function register(
  email: string,
  password: string,
  username: string
) {
  console.log("In register.");
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!NEXT_PUBLIC_BASE_URL) {
    throw new Error("Missing env NEXT_PUBLIC_BASE_URL");
  }

  const supabase = await createClient();

  const result = registerSchema.safeParse({ email, password, username });
  if (!result.success) {
    return { message: "Invalid Credentials" };
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  console.log("existingProfile is ", existingProfile);

  if (existingProfile) {
    return { message: "Username is already taken" };
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${NEXT_PUBLIC_BASE_URL}/home`,
    },
  });

  console.log("authData is ", authData);
  console.log("error is ", error);

  if (error) {
    return { message: error.message };
  }

  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      username: username,
    });

    console.log("profileError is ", profileError);

    if (profileError) {
      return { message: "Failed to create profile" };
    }
  }

  redirect("/home");
}

export async function signInWithGoogle() {
  console.log("In signInWithGoogle.");
  const supabase = await createClient();
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!NEXT_PUBLIC_BASE_URL) {
    throw new Error("Missing env NEXT_PUBLIC_BASE_URL");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });
  console.log("data is ", data);
  console.log("error is ", error);

  if (error) {
    return { message: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function createUsernameForOAuthUser(username: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Not authenticated" };
  }

  if (!username || username.length < 3 || username.length > 20) {
    return { message: "Username must be between 3 and 20 characters" };
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingProfile) {
    return { message: "Username is already taken" };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    username: username,
  });

  console.log("profileError is ", profileError);

  if (profileError) {
    return { message: "Failed to create profile" };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
