"use client";
import ImageAvatar from "@/components/ImageAvatar";
import CommentForm from "@/components/comments/CommentForm";
import TweetItem from "@/components/feed/TweetItem";
import Header from "@/components/layout/Header";
import usePost from "@/hooks/usePost";
import { formatDistanceToNowStrict } from "date-fns";
import { Loader } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
interface PostDetailPage {
  params: {
    postId: string;
  };
}
const PostDetailPage = ({ params }: PostDetailPage) => {
  const { postId } = params;
  const { data: post, isLoading, error } = usePost({ postId });
  if (error) {
    toast.error("Something went wrong!");
  }
  return (
    <>
      <Header label={"Tweet"} back />
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
                className="mt-6 flex flex-col gap-1 px-3 py-1.5 border-b last:border-none"
              >
                <div className="flex items-center space-x-1">
                  <ImageAvatar
                    fallback={comment.user.name[0]}
                    imageUrl={comment.user.profileImage as string}
                    userId={comment.user.id}
                    size="sm"
                  />
                  <span className="font-semibold text-black">
                    {comment.user.username}
                  </span>
                  <span className="text-sm hidden md:block">
                    @{comment.user.username}
                  </span>{" "}
                  <span className="hidden md:block">·</span>
                  <span className="text-sm hidden md:block">
                    {formatDistanceToNowStrict(new Date(comment.createdAt))} ago
                  </span>
                </div>
                <p className="mt-1">{comment.body}</p>
              </div>
            ))
          ) : (
            <h2 className="mt-12 text-center">No Comments yet!</h2>
          )}
        </>
      ) : null}

      {!post && !isLoading ? <h1 className="text-center mt-12 text-lg">
        The tweet you&apos;re looking for is not exist.
      </h1> : null}
    </>
  );
};

export default PostDetailPage;
