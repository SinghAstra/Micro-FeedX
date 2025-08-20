"use client";

import { FolderIcon } from "lucide-react";
import Link from "next/link";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
}

export function FolderList({ folders }: FolderListProps) {
  if (!folders || folders.length === 0) {
    return ;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {folders.map((folder) => (
        <Link key={folder.id} href={`/dashboard/${folder.id}`}>
          <div className="hover:shadow-lg transition-shadow hover:bg-muted/40 rounded flex flex-row items-center border px-4 py-2">
            <p className="text-sm font-medium w-full">{folder.name}</p>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}
