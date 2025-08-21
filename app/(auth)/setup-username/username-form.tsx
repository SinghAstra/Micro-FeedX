"use client";

import { createUsernameForOAuthUser } from "@/actions/auth";
import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function UsernameForm() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToastMessage } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!username.trim()) {
      setToastMessage("Username is required");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setToastMessage("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (username.length > 20) {
      setToastMessage("Username must be less than 20 characters");
      setLoading(false);
      return;
    }

    const result = await createUsernameForOAuthUser(username);
    if (result?.message) {
      setToastMessage(result.message);
    } else {
      router.push("/home");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-card-foreground">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Choose a unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-input border text-card-foreground placeholder:text-muted-foreground [&:-webkit-autofill]:bg-input [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--input))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--card-foreground))]"
        />
        <p className="text-xs text-muted-foreground">
          Your username will be visible to other users and cannot be changed
          later.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={loading || !username.trim()}
      >
        {loading ? "Creating profile..." : "Complete setup"}
      </Button>
    </form>
  );
}
