"use client";
import React from "react";
import { Button } from "../ui/button";
import ImageAvatar from "../ImageAvatar";
import useToggleFollow from "@/hooks/useToggleFollow";
import useCurrentUser from "@/hooks/useCurrentUser";

interface FollowbarItemProps {
  profileImage: string;
  name: string;
  username: string;
  userId: string;
}
const FollowbarItem: React.FC<FollowbarItemProps> = ({
  name,
  profileImage,
  username,
  userId,
}) => {
  const { handleToggleFollow, isFollowing, isLoading } = useToggleFollow({
    userId,
  });
  const { data: currentUser } = useCurrentUser();
  if (currentUser?.id === userId) return null;

  return (
    <div className="flex items-center gap-x-2 justify-between max-w-sm border-b w-full p-2 pb-3 last:border-none bg-white dark:bg-dark">
      <div className="flex flex-1 max-w-[70%]">
        <ImageAvatar
          imageUrl={profileImage}
          fallback={name[0]}
          userId={userId}
        />
        <div className="flex flex-col ml-1 w-3/4">
          <h3 className="truncate w-full">{name}</h3>
          <small className="text-gray-600 text-sm truncate">@{username}</small>
        </div>
      </div>
      <Button disabled={isLoading} onClick={handleToggleFollow}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default FollowbarItem;
