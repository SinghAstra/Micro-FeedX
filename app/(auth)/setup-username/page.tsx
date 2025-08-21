import { getAuthData } from "@/actions/server-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { redirect } from "next/navigation";
import UsernameForm from "./username-form";

async function SetupUsernamePage() {
  const { user, profile } = await getAuthData();

  // Redirect if user is not authenticated or already has a profile
  if (!user || profile) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Choose your username
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Complete your profile to start using {siteConfig.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsernameForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default SetupUsernamePage;
