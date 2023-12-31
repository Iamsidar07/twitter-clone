"use client";
import usePost from "@/hooks/usePost";
import { Loader } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import TweetItem from "./TweetItem";
import CommentForm from "../comments/CommentForm";
import ImageAvatar from "../ImageAvatar";
import { formatDistanceToNowStrict } from "date-fns";

const PostDetail = ({ postId }: { postId: string }) => {
  const { data: post, isLoading, error } = usePost({ postId });
  if (error) {
    toast.error("Something went wrong!");
  }

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center mt-12">
          <Loader className="w-5 h-5 animate-spin" />
        </div>
      ) : null}
      {post ? (
        <>
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
          <CommentForm postId={post.id} />
          {post.comments?.length > 0 ? (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="mt-6 flex flex-col gap-1 p-3 border-b last:border-none"
              >
                <div className="flex items-center space-x-1">
                  <ImageAvatar
                    fallback={comment.user.name[0]}
                    imageUrl={comment.user.profileImage as string}
                    userId={comment.user.id}
                    size="sm"
                  />
                  <p className="flex items-center space-x-1 text-gray-400 dark:text-gray-300">
                    <span className="font-semibold">
                      {comment.user.username}
                    </span>
                    <span className="text-sm hidden md:block">
                      @{comment.user.username}
                    </span>{" "}
                    <span className="hidden md:block">·</span>
                    <span className="text-sm hidden md:block">
                      {formatDistanceToNowStrict(new Date(comment.createdAt))}{" "}
                      ago
                    </span>
                  </p>
                </div>
                <p className="mt-1">{comment.body}</p>
              </div>
            ))
          ) : (
            <h2 className="mt-12 text-center">No Comments yet!</h2>
          )}
        </>
      ) : null}

      {!post && !isLoading ? (
        <h1 className="text-center mt-12 text-lg">
          The tweet you&apos;re looking for is not exist.
        </h1>
      ) : null}
    </>
  );
};

export default PostDetail;
