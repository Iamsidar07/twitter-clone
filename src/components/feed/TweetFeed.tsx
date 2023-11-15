"use client";
import { trpc } from "@/app/_trpc/client";
import { Loader } from "lucide-react";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import TweetItem from "./TweetItem";
import { INFINITE_QUERY_LIMIT } from "@/config/inifiteQuery";
import { useIntersection } from "@mantine/hooks";
interface TweetFeedProps {
  userId?: string;
}
const TweetFeed: React.FC<TweetFeedProps> = ({ userId }) => {
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const {
    data,
    isLoading,
    fetchNextPage,
    error,
    refetch: refetchPosts,
  } = trpc.getPosts.useInfiniteQuery(
    {
      userId,
      limit: INFINITE_QUERY_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts);

  if (error) {
    toast.error("Failed to load your feed.");
    return (
      <h1 className="text-center mt-8">
        Something went wrong!{" "}
        <span className="font-bold underline" onClick={() => refetchPosts()}>
          try again
        </span>
      </h1>
    );
  }
  return (
    <div className="mt-4">
      {isLoading ? (
        <div className="mt-12 grid place-items-center">
          <Loader className="w-5 h-5 animate-spin" />
        </div>
      ) : null}
      {posts?.length === 0 ? (
        <h1 className="text-center font-bold text-lg mt-12">Feed is empty</h1>
      ) : (
        posts?.map((post, i) => {
          const isLastPost = i === posts.length - 1;
          if (isLastPost) {
            return (
              <TweetItem
                body={post.body}
                key={post.id}
                comments={post.comments.length}
                postId={post.id}
                userId={post.user.id}
                createdAt={post.createdAt}
                likedIds={post.likedIds}
                name={post.user.name}
                profileImage={post.user.profileImage as string}
                username={post.user.username}
                imageContent={post.imageContent as string}
                ref={ref}
              />
            );
          }

          return (
            <TweetItem
              body={post.body}
              key={post.id}
              comments={post.comments.length}
              postId={post.id}
              userId={post.user.id}
              createdAt={post.createdAt}
              likedIds={post.likedIds}
              name={post.user.name}
              profileImage={post.user.profileImage as string}
              username={post.user.username}
              imageContent={post.imageContent as string}
            />
          );
        })
      )}
    </div>
  );
};

export default TweetFeed;
