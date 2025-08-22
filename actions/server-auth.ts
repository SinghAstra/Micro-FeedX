import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getAuthData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export async function requireAuth() {
  const { user, profile } = await getAuthData();

  if (!user) {
    redirect("/login");
  }

  if (!profile) {
    redirect("/setup-username");
  }

  return { user, profile };
}

export async function requireGuest() {
  const { user, profile } = await getAuthData();

  if (user && !profile) {
    redirect("/setup-username");
  }

  if (user && profile) {
    redirect("/home");
  }
}
