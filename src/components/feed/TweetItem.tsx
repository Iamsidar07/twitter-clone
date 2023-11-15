"use client";
import { formatDistanceToNowStrict } from "date-fns";
import { MessageCircle, HeartIcon, Bookmark } from "lucide-react";
import React, { useCallback } from "react";
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
const TweetItem: React.FC<TweetItemProps> = ({
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
}) => {
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
  console.log({ hasBookmarked: hasBookmarked() }, bookmarkIds);
  return (
    <div
      onClick={() => handleClickPost(postId)}
      key={postId}
      className="flex items-start w-full p-5 border-b last:border-none bg-white dark:bg-dark cursor-pointer"
    >
      <ImageAvatar
        imageUrl={profileImage as string}
        fallback={name[0]}
        userId={userId}
      />
      <div className="flex flex-col ml-1.5 flex-1">
        <p className="text-gray-500 dark:text-gray-200 flex items-center space-x-2">
          <span className="font-semibold">{name}</span>
          <span className="text-sm hidden md:block">@{username}</span>{" "}
          <span className="hidden md:block">·</span>
          <span className="text-sm hidden md:block">
            {formatDistanceToNowStrict(new Date(createdAt))} ago
          </span>
        </p>
        <p className="py-2">{body}</p>
        {imageContent ? (
          <Image
            src={imageContent}
            alt="twitter media"
            width={1920}
            height={1080}
            className="object-cover rounded-lg border h-72"
          />
        ) : null}
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="flex items-center text-gray-400 gap-1 group hover:text-pink-600">
            <MessageCircle className="cursor-pointer w-10 h-10 rounded-full p-2 group-hover:bg-pink-100 dark:group-hover:bg-dark2" />
            <span>{comments}</span>
          </div>
          <div
            onClick={handleBookmarkPost}
            className={`flex items-center text-gray-400 gap-x-1 group hover:text-green-600 ${hasBookmarked() ? " text-green-500" : ""
              } ${isSavingToBookmark ? "opacity-70" : ""}
`}
          >
            <Bookmark
              className={`cursor-pointer w-10 h-10 rounded-full p-2 group-hover:bg-pink-100 dark:group-hover:bg-dark2 `}
            />
            <span>save</span>
          </div>
          <div
            onClick={handleLikeClick}
            className="flex items-center text-gray-400 gap-1 group hover:text-blue-600"
          >
            <HeartIcon
              className={`cursor-pointer w-10 h-10 rounded-full p-2 group-hover:bg-blue-100 dark:group-hover:bg-dark2 ${isAllreadyLikedPost ? "text-blue-600" : ""
                } ${isLoading ? "opacity-30" : ""}`}
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
};

export default TweetItem;
