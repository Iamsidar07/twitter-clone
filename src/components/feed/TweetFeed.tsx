"use client";
import { trpc } from "@/app/_trpc/client";
import { HeartIcon, Loader, MessageCircle } from "lucide-react";
import React, { MouseEventHandler, useCallback } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import ImageAvatar from "../ImageAvatar";
import { useRouter } from "next/navigation";
import TweetItem from "./TweetItem";
interface TweetFeedProps {
  userId?: string;
}
const TweetFeed: React.FC<TweetFeedProps> = ({ userId }) => {
  const router = useRouter()
  const {
    data: posts,
    isLoading,
    error,
    refetch: refetchPosts,
  } = trpc.getPosts.useQuery({ userId });


  const handleLikeClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    // Do logic for liking post
    console.log("hello like")
  }, []);

  const handleCommentOnPost = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Do logic for comments on post
    event.stopPropagation()
    console.log("comment")
  }, []);

  const handleClickPost = useCallback((postId: string) => {
    if (postId) {
      router.push(`/post/${postId}`)
    }
  }, [router])

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
        posts?.map((post) => (
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
        ))
      )}
    </div>
  );
};

export default TweetFeed;
