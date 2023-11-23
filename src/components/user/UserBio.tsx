"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import { format } from "date-fns";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { Calendar } from "lucide-react";
import useEditProfileModal from "@/hooks/useEditProfileModal";
import useToggleFollow from "@/hooks/useToggleFollow";
interface UserBioProps {
  userId: string;
  name: string;
  username: string;
  createdAt: Date;
  followerCount: number;
  followingCount: number;
  bio?: string | null;
}
const UserBio: React.FC<UserBioProps> = ({
  username,
  createdAt,
  name,
  userId,
  followerCount,
  bio,
  followingCount,
}) => {
  const { handleToggleFollow, isFollowing, isLoading } = useToggleFollow({
    userId,
  });
  const { data: currentUser } = useCurrentUser();
  const editProfileModal = useEditProfileModal();
  const joined = format(new Date(createdAt), "MMMM yyyy");

  return (
    <div className="relative border-b-[1px] px-4 py-3">
      <div className="flex justify-end">
        {currentUser?.id === userId ? (
          <Button
            className={buttonVariants({
              size: "lg",
              className: "rounded-full",
            })}
            onClick={() => editProfileModal.open()}
          >
            Edit
          </Button>
        ) : (
          <Button
            className={buttonVariants({
              size: "lg",
              className: "rounded-full",
            })}
            onClick={handleToggleFollow}
            disabled={isLoading}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
      <div className="flex flex-col mt-6">
        <p className="font-bold text-lg">{name}</p>
        <p className="text-gray-500">@{username}</p>
        {bio ? <p className="font-sm">{bio}</p> : null}
        <div className="flex gap-x-1.5 text-gray-500 items-center mt-2">
          <Calendar className="text-gray-500 w-4 h-4" />
          <p>Joined {joined}</p>
        </div>
        <div className="flex items-center gap-x-2 mt-2">
          <p>
            {followingCount} <span className="text-gray-500">Following</span>{" "}
          </p>
          <p>
            {followerCount} <span className="text-gray-500">Followers</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
