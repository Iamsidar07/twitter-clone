"use client";
import { formatDistanceToNowStrict } from "date-fns";
import { MessageCircle, HeartIcon, Bookmark } from "lucide-react";
import React, { forwardRef, useCallback } from "react";
import ImageAvatar from "../ImageAvatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useToggleLike from "@/hooks/useToggleLike";
import toast from "react-hot-toast";
import useCreateBookmark from "@/hooks/useCreateBookmark";
import useCurrentUser from "@/hooks/useCurrentUser";
interface TweetItemProps {
  comments: number;
  name: string;
  username: string;
  profileImage: string;
  body: string;
  createdAt: string;
  likedIds: string[];
  postId: string;
  userId: string;
  imageContent?: string;
  bookmarkIds?: string[];
}
const TweetItem = forwardRef<HTMLDivElement, TweetItemProps>(
  (
    {
      postId,
      body,
      comments,
      createdAt,
      likedIds,
      name,
      profileImage,
      username,
      userId,
      imageContent,
      bookmarkIds,
    },
    ref,
  ) => {
    const router = useRouter();
    const { data: currentUser } = useCurrentUser();
    const { error, handleToggleLikePost, isAllreadyLikedPost, isLoading } =
      useToggleLike({ postId });
    const hasBookmarked = useCallback(
      () => bookmarkIds?.includes(currentUser?.id as string),
      [bookmarkIds, currentUser?.id],
    );
    const { handleCreateBookmark, isLoading: isSavingToBookmark } =
      useCreateBookmark();
    const handleLikeClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        handleToggleLikePost();
      },
      [handleToggleLikePost],
    );
    const handleBookmarkPost = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        handleCreateBookmark({ postId });
      },
      [handleCreateBookmark, postId],
    );

    const handleClickPost = useCallback(
      (postId: string) => {
        if (postId) {
          router.push(`/post/${postId}`);
        }
      },
      [router],
    );

    if (error) {
      toast.error("Something went wrong!");
    }

    return (
      <div
        ref={ref}
        onClick={() => handleClickPost(postId)}
        key={postId}
        className="flex flex-col items-start w-full px-1.5 py-2.5 lg:p-5 border-b last:border-none bg-white dark:bg-dark cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <ImageAvatar
            imageUrl={profileImage as string}
            fallback={name[0]}
            userId={userId}
          />
          <p className="text-gray-500 dark:text-gray-200 flex items-center space-x-2">
            <span className="font-semibold">{name}</span>
            <span className="text-sm hidden md:block">@{username}</span>{" "}
            <span className="hidden md:block">·</span>
            <span className="text-sm hidden md:block">
              {formatDistanceToNowStrict(new Date(createdAt))} ago
            </span>
          </p>
        </div>
        <div className="flex flex-col w-full ml-1.5 flex-1 ">

          <p className="py-2">{body}</p>

          {imageContent ? (
            <div className="w-[90%] lg:w-full relative  h-44 lg:h-72">
              <Image
                src={imageContent}
                alt="twitter media"
                fill
                className="object-cover absolute rounded-lg border lg:h-72"
              />
            </div>
          ) : null}
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="flex items-center text-gray-400 gap-1 group hover:text-pink-600">
              <MessageCircle className="cursor-pointer w-10 h-10 rounded-full p-2 group-hover:bg-pink-100 dark:group-hover:bg-dark2" />
              <span>{comments}</span>
            </div>
            <div
              onClick={handleBookmarkPost}
              className={`flex items-center gap-x-1 group hover:text-green-600 ${hasBookmarked() ? " text-green-500" : "text-gray-400 "
                } ${isSavingToBookmark ? "opacity-70" : ""}`}
            >
              <Bookmark
                className={`cursor-pointer w-10 h-10 rounded-full p-2 group-hover:bg-pink-100 dark:group-hover:bg-dark2 `}
              />
              <span>save</span>
            </div>
            <div
              onClick={handleLikeClick}
              className={`flex items-center gap-1 group hover:text-blue-600 ${isAllreadyLikedPost ? " text-blue-600" : "text-gray-400"}`}
            >
              <HeartIcon
                className={`cursor-pointer w-10 h-10 rounded-full p-2 group-hover:bg-blue-100 dark:group-hover:bg-dark2 ${isLoading ? "opacity-30" : ""}`}
              />
              <span>{likedIds.length}</span>
            </div>
          </div>
          <span className="font-semibold text-sm text-blue-500 cursor-pointer">
            Show this thread
          </span>
        </div>
      </div>
    );
  },
);
TweetItem.displayName = "TweetItem";
export default TweetItem;
