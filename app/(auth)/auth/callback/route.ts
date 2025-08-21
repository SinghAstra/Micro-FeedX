import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("In /auth/callback.");
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  console.log("code is ", code);
  console.log("next is ", next);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("data is ", data);
    console.log("error is ", error);

    if (!error && data.user) {
      // Check if user has a profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      console.log("profile is ", profile);

      if (!profile) {
        // New user needs to set up username
        return NextResponse.redirect(`${origin}/setup-username`);
      }

      // Existing user, redirect to feed
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
