"use client";

import { register as registerAction, signInWithGoogle } from "@/actions/auth";
import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { RegisterFormData, registerSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function RegisterPage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { setToastMessage } = useToastContext();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsManualLoading(true);
    const result = await registerAction(
      data.email,
      data.password,
      data.username
    );
    if (result?.message) {
      setToastMessage(result.message);
    }
    setIsManualLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result?.message) {
      setToastMessage(result.message);
    }
    setIsGoogleLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-card-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                className="bg-input border text-card-foreground placeholder:text-muted-foreground [&:-webkit-autofill]:bg-input [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--input))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--card-foreground))]"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-destructive text-sm text-right">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-input border text-card-foreground placeholder:text-muted-foreground [&:-webkit-autofill]:bg-input [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--input))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--card-foreground))]"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm text-right">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="bg-input border text-card-foreground placeholder:text-muted-foreground pr-10 [&:-webkit-autofill]:bg-input [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--input))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--card-foreground))]"
                  {...register("password")}
                />
                <div className=" absolute inset-y-0 right-0 pr-3 flex items-center ">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm text-right">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isManualLoading || !isValid}
            >
              {isManualLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 border"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isGoogleLoading ? "Signing up..." : "Continue with Google"}
          </Button>

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
