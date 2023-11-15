import { Comment, Post, User } from "@prisma/client";
import { HeartIcon, MessagesSquare } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TweetProps extends Post {
  user: User;
  comments: Comment[];
}
const Tweet: React.FC<TweetProps> = ({
  body,
  comments,
  createdAt,
  likedIds,
  user,
  userId,
  id,
  updatedAt,
}) => {
  return (
    <div className="flex items-start w-full p-2 border-b last:border-none bg-white">
      <div className="w-12 h-12 relative rounded-full">
        <Image
          src={user.profileImage ?? "/placeholder.png"}
          alt={user.name}
          fill
          className="absolute w-full h-full object-cover rounded-full border"
        />
      </div>
      <div className="flex flex-col ml-1.5 flex-1">
        <p className="text-gray-500 flex items-center space-x-2">
          <span className="font-semibold text-black">{user.name}</span>
          <span>@{user.username}</span> <span>.</span>
          <span>23 s</span>
        </p>
        <p>{body}</p>
        <Image
          src={"/next.svg"}
          alt="next"
          width={1920}
          height={1080}
          className="object-contain rounded-lg border h-72"
        />
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="flex items-center text-gray-400 gap-1.5">
            <MessagesSquare className="cursor-pointer" />
            <span>{comments.length}</span>
          </div>
          <div className="flex items-center text-gray-400 gap-1.5">
            <HeartIcon className="cursor-pointer" />
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

export default Tweet;
