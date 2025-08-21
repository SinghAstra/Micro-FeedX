import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/home";
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    console.log("Verification result:", { data, error });

    if (!error) {
      redirect(next);
    } else {
      console.log("Email verification error:", error);
      redirect(`/login`);
    }
  } else {
    console.log("Missing required parameters:", code);
    redirect("/login");
  }
}
