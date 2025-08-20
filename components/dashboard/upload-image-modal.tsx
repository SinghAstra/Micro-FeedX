"use client";

import { uploadImage } from "@/actions/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
}

export function UploadImageModal({
  isOpen,
  onClose,
  folderId,
}: UploadImageModalProps) {
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    if (!selectedFile) {
      toast.error("Please select an image file.");
      setIsPending(false);
      return;
    }

    const result = await uploadImage(imageName, selectedFile, folderId);

    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }
    setImageName("");
    setSelectedFile(null);
    setIsPending(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      if (imageName === "") {
        setImageName(event.target.files[0].name.split(".")[0]);
      }
    } else {
      setSelectedFile(null);
      setImageName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload a new image to this folder.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageName" className="text-right">
                Name
              </Label>
              <Input
                id="imageName"
                name="imageName"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                className="col-span-3"
                required
                disabled={isPending}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 ">
              <Label htmlFor="imageFile" className="text-right">
                File
              </Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="col-span-3 cursor-pointer"
                required
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Uploading..." : "Upload Image"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
