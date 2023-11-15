"use client";
import useBookmark from "@/hooks/useBookmark";
import { Loader } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import TweetItem from "../feed/TweetItem";

const BookmarkFeed = () => {
  const { bookmarks = [], isLoading, error } = useBookmark();
  if (isLoading) {
    return (
      <div className="w-full grid place-items-center mt-12">
        <Loader className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  if (error) {
    toast.error("Something went wrong!");
  }
  return (
    <div className="pt-12">
      {bookmarks?.length > 0 ? (
        bookmarks?.map(({ post }) => (
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
            bookmarkIds={post.bookmarkIds}
          />
        ))
      ) : (
        <h1 className="text-center">Seems like no bookmarks yet!</h1>
      )}
    </div>
  );
};

export default BookmarkFeed;
