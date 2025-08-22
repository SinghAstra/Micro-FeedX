"use client";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { scaleInVariant } from "@/lib/variants";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AvatarMenu } from "./avatar-menu";
import CreatePostDialog from "./create-post-dialog";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);

  return (
    <>
      <div className="sticky w-full top-0 inset-x-0 z-50 flex items-center justify-between  p-4 sm:px-8 border-b border-dashed bg-background">
        <Link href="/home">
          <span className="text-xl tracking-wider">{siteConfig.name}</span>
        </Link>

        <div className="flex items-center  gap-4">
          <motion.div
            variants={scaleInVariant}
            className={cn(
              buttonVariants({
                variant: "outline",
                className:
                  "bg-transparent hover:bg-muted/60 rounded cursor-pointer transition-all duration-300",
              })
            )}
            onClick={() => setShowCreatePostDialog(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:block">Create Post</span>
          </motion.div>
          <AvatarMenu user={user} />
        </div>
      </div>
      <CreatePostDialog
        showCreatePostDialog={showCreatePostDialog}
        setShowCreatePostDialog={setShowCreatePostDialog}
      />
    </>
  );
}
