"use client";

import { Image as ImageItem } from "@prisma/client";
import Image from "next/image";

interface ImageListProps {
  images: ImageItem[];
}

export function ImageList({ images }: ImageListProps) {
  if (!images || images.length === 0) {
    return;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 px-4 sm:px-8">
      {images.map((image) => (
        <div
          key={image.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-200 hover:scale-105"
            />
            <div className="absolute bottom-0 inset-x-0 bg-muted/40 px-2 py-1">
              <p>{image.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
