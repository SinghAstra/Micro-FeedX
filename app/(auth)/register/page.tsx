"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { Eye, EyeOff, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function RegisterPage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex min-h-screen p-4">
      <div className="p-8 space-y-6 flex-1 flex flex-col items-center justify-center relative">
        <Link href="/">
          <div className="flex items-center space-x-2 mb-16 md:mb-0 md:absolute md:top-0 md:left-0">
            <Loader className="h-6 w-6 text-primary" />{" "}
            <span className="text-lg font-semibold text-foreground">
              {siteConfig.name}
            </span>
          </div>
        </Link>
        <div className="max-w-xl w-full space-y-6 flex flex-col ">
          <div className="space-y-2 w-full">
            <h1 className="text-3xl font-bold text-foreground">Sign up</h1>
            <p className="text-muted-foreground">
              Sign up to enjoy the features of {siteConfig.name}
            </p>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:flex relative flex-1">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-muted/40 border-muted-foreground rounded-xl" />
        )}
        <Image
          src="/assets/bg-auth.jpg"
          alt="Auth"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setIsImageLoaded(true)}
          className={`object-cover transition-opacity duration-700 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority
        />
      </div>
    </div>
  );
}

export default RegisterPage;
