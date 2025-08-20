import { getFolderPath } from "@/actions/folder";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbsProps {
  currentFolderId: string;
}

export async function Breadcrumbs({ currentFolderId }: BreadcrumbsProps) {
  console.log("In BreadCrumb");
  console.log("currentFolderId is ", currentFolderId);

  const path = await getFolderPath(currentFolderId);

  if (!path) {
    return;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground px-4 sm:px-8 py-2 ">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground"
      >
        Home
      </Link>
      {path.map((item) => (
        <span
          key={item.id}
          className="flex items-center hover:underline transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4 mx-1 text-primary" />
          <Link
            href={`/dashboard/${item.id}`}
            className="hover:text-foreground"
          >
            {item.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
