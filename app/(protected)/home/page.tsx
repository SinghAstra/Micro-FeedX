import { getPosts } from "@/actions/posts";
import { getAuthData } from "@/actions/server-auth";
import { Navbar } from "@/components/home/navbar";
import { Post } from "@/interfaces/post";
import { redirect } from "next/navigation";
import React from "react";
import HomeClientPage from "./home-client";

interface HomePageProps {
  searchParams: Promise<{ query?: string; filter?: "all" | "me" }>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { query: queryParam, filter: filterParam } = await searchParams;
  let posts: Post[] = [];
  let nextCursor: string | undefined = undefined;
  let hasMore = false;
  let message: string | undefined = undefined;
  const { user } = await getAuthData();

  if (!user) {
    redirect("/");
  }

  try {
    const initialData = await getPosts(undefined, queryParam, 10, filterParam);
    console.log("initialData.posts.length is ", initialData.posts?.length);
    console.log("initialData.post is ", initialData.posts);

    if (initialData.posts) {
      posts = initialData.posts;
      nextCursor = initialData.nextCursor;
      hasMore = initialData.hasMore;
    } else {
      message = initialData.message || "Failed to fetch initial posts.";
    }
  } catch (error) {
    message = "Failed to fetch initial posts.";
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col px-4">
      <Navbar user={user} />
      <HomeClientPage
        initialPosts={posts}
        initialCursor={nextCursor}
        initialHasMore={hasMore}
        initialQuery={queryParam || ""}
        initialFilter={filterParam || "all"}
        initialMessage={message}
      />
    </div>
  );
};

export default HomePage;
