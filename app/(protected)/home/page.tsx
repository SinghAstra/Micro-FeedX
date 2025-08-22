import { getAuthData } from "@/actions/server-auth";
import CreateNewPost from "@/components/home/create-new-post";
import { Navbar } from "@/components/home/navbar";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = async () => {
  const { user } = await getAuthData();
  if (!user) {
    redirect("/");
  }
  const query = searchParams.query || "";
  const initialData = await getPosts(undefined, query, 10);
  return (
    <div className="min-h-screen relative flex flex-col px-4">
      <Navbar user={user} />
      <div className="max-w-2xl w-full mx-auto mt-4">
        <CreateNewPost />
        <SearchBar initialQuery={query} />
        <PostFeed
          initialPosts={initialData.posts}
          initialCursor={initialData.nextCursor}
          initialHasMore={initialData.hasMore}
          searchQuery={query}
        />
      </div>
    </div>
  );
};

export default HomePage;
