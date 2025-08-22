"use client";

import { Post } from "@/interfaces/post";
import { Dispatch, SetStateAction } from "react";
import Dialog from "../component-x/dialog";
import { Button } from "../ui/button";
import CreateNewPost from "./create-new-post";

interface CreatePostDialogProps {
  showCreatePostDialog: boolean;
  setShowCreatePostDialog: Dispatch<SetStateAction<boolean>>;
  onPostCreated: (newPost: Post) => void;
}

function CreatePostDialog({
  showCreatePostDialog,
  setShowCreatePostDialog,
  onPostCreated,
}: CreatePostDialogProps) {
  const handlePostCreated = (newPost: Post) => {
    setShowCreatePostDialog(false);
    onPostCreated(newPost);
  };

  if (!showCreatePostDialog) return;

  return (
    <Dialog
      isDialogVisible={showCreatePostDialog}
      setIsDialogVisible={setShowCreatePostDialog}
    >
      <div className="p-4">
        <CreateNewPost onPostCreated={handlePostCreated} />

        <div className="flex justify-start pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCreatePostDialog(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default CreatePostDialog;
