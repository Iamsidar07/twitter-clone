"use client";
import React from "react";
import Image from "next/image";
import { trpc } from "@/app/_trpc/client";
import ImageAvatar from "../ImageAvatar";
interface UserHeroProps {
  userId: string;
}
const UserHero: React.FC<UserHeroProps> = ({ userId }) => {
  const { data } = trpc.getUser.useQuery({ userId });
  return (
    <div className="relative">
      <div className="relative h-44 bg-gray-500">
        {data?.user?.coverImage ? (
          <Image
            src={data.user.coverImage}
            alt="cover iamge"
            fill
            className="absolute object-cover w-full h-full"
          />
        ) : null}
      </div>
      <div className="-bottom-16 absolute left-4">
        <ImageAvatar
          imageUrl={data?.user?.profileImage as string}
          fallback={data?.user?.name[0] as string}
          userId={userId}
          outline={true}
          size="lg"
        />
      </div>
    </div>
  );
};

export default UserHero;
