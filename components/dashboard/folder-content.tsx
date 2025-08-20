"use client";

import { FolderList } from "@/components/dashboard/folder-list";
import { NewFolderModal } from "@/components/dashboard/new-folder-modal";
import { Button } from "@/components/ui/button";
import { Image } from "@prisma/client";
import { Plus, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useToastContext } from "../providers/toast";
import { ImageList } from "./image-list";
import { UploadImageModal } from "./upload-image-modal";

interface Folder {
  id: string;
  name: string;
}

interface DashboardContentProps {
  folders: Folder[];
  currentFolderId: string | null;
  images: Image[];
}

export function FolderContent({
  folders,
  currentFolderId,
  images,
}: DashboardContentProps) {
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const hasContent = folders.length > 0 || images.length > 0;
  const { setToastMessage } = useToastContext();

  const handleUploadImageClick = () => {
    if (currentFolderId) {
      setIsUploadImageModalOpen(true);
    } else {
      setToastMessage("Please navigate into a folder to upload images.");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-8 md:py-4">
      {hasContent ? (
        <>
          <FolderList folders={folders} />
          <ImageList images={images} />
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">
            No folders or images found in this location.
          </p>
          <div className="flex flex-col gap-2 w-fit">
            <Button
              variant={"outline"}
              className="hover:bg-muted/40 transition-all duration-200 font-normal w-full"
              onClick={() => setIsNewFolderModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> New Folder
            </Button>
            {currentFolderId && (
              <Button
                variant={"outline"}
                className="hover:bg-muted/40 transition-all duration-200 font-normal w-full"
                onClick={handleUploadImageClick}
              >
                <UploadIcon className="mr-2 h-4 w-4" /> Upload Image
              </Button>
            )}
          </div>
        </div>
      )}

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
    </div>
  );
}
