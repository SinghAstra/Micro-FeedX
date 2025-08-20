"use client";

import { logOutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { User } from "@prisma/client";
import {
  Loader,
  LogOutIcon,
  Plus,
  Search,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToastContext } from "../providers/toast";
import { NewFolderModal } from "./new-folder-modal";
import { SearchModal } from "./search-modal";
import { UploadImageModal } from "./upload-image-modal";

interface NavbarProps {
  currentUser: User;
  currentFolderId: string | null;
}

export function Navbar({ currentUser, currentFolderId }: NavbarProps) {
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { setToastMessage } = useToastContext();

  const handleUploadImageClick = () => {
    if (currentFolderId) {
      setIsUploadImageModalOpen(true);
    } else {
      setToastMessage("Please navigate into a folder to upload images.");
    }
  };

  const handleLogout = async () => {
    await logOutUser("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-lg backdrop-blur-lg">
        <div className="flex items-center justify-between py-3 px-4 sm:px-8">
          <Link href="/dashboard">
            <div className="flex items-center space-x-2 ">
              <Loader className="h-6 w-6 text-primary" />{" "}
              <span className="text-lg font-semibold text-foreground">
                {siteConfig.name}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              className="hover:bg-muted/40 transition-all duration-200 font-normal"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            {currentFolderId && (
              <Button
                variant={"outline"}
                className="hover:bg-muted/40 transition-all duration-200 font-normal"
                onClick={handleUploadImageClick}
              >
                <UploadIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Upload Image</span>
              </Button>
            )}
            <Button
              variant={"outline"}
              className="hover:bg-muted/40 transition-all duration-200 font-normal"
              onClick={() => setIsNewFolderModalOpen(true)}
            >
              <Plus className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Folder</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full border hover:bg-muted/40"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-4" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-muted/40 transition-all duration-200 cursor-pointer"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        parentId={currentFolderId}
      />
      {currentFolderId && (
        <UploadImageModal
          isOpen={isUploadImageModalOpen}
          onClose={() => setIsUploadImageModalOpen(false)}
          folderId={currentFolderId}
        />
      )}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
