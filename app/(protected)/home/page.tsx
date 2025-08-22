import { getPosts } from "@/actions/posts";
import { getAuthData } from "@/actions/server-auth";
import CreateNewPost from "@/components/home/create-new-post";
import { Navbar } from "@/components/home/navbar";
import { PostFeed } from "@/components/home/post-feed";
import { SearchBar } from "@/components/home/search-bar";
import { redirect } from "next/navigation";
import React from "react";

interface HomePageProps {
  searchParams: Promise<{ query?: string; filter?: "all" | "me" }>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { user } = await getAuthData();
  if (!user) {
    redirect("/");
  }

  const { query: userQuery, filter: userFilter } = await searchParams;
  const query = userQuery || "";
  const filter = userFilter || "all";

  const initialData = await getPosts(undefined, query, 10, filter, user.id);

  console.log("initialData.posts.length is ", initialData.posts?.length);

  return (
    <div className="min-h-screen relative flex flex-col px-4">
      <Navbar user={user} />
      <div className="max-w-2xl w-full mx-auto mt-4 flex flex-col gap-4 flex-1">
        <CreateNewPost />
        <SearchBar initialQuery={query} initialFilter={filter} />
        {initialData.posts ? (
          <PostFeed
            posts={initialData.posts}
            // initialCursor={initialData.nextCursor}
            // initialHasMore={initialData.hasMore}
            // searchQuery={query}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Failed to Fetch Posts. Please Try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
