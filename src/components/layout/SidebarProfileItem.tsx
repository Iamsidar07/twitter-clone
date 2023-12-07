"use client";
import { trpc } from "@/app/_trpc/client";
import React from "react";
import ImageAvatar from "../ImageAvatar";

const SidebarProfileItem = () => {
  const { data } = trpc.currentUser.useQuery();
  return (
    <>
      <div className="lg:hidden relative h-14 w-14 rounded-full">
        <ImageAvatar
          imageUrl={data?.profileImage as string}
          fallback={data?.name[0] as string}
          userId={data?.id as string}
          outline={true}
        />
      </div>
      <div className="hidden lg:flex items-center gap-1.5 border-[1px] rounded-full pl-2 pr-3.5 py-1.5 cursor-pointer hover:bg-blue-300 dark:hover:bg-dark2 hover:bg-opacity-30 transition">
        <ImageAvatar
          imageUrl={data?.profileImage as string}
          fallback={data?.name[0] as string}
          userId={data?.id as string}
          outline={true}
        />
        <div className="hidden lg:flex flex-col w-3/4">
          <p className="font-bold truncate">{data?.name}</p>
          <small className="text-gray-500 truncate pr-1.5">@{data?.username}</small>
        </div>
      </div>
    </>
  );
};

export default SidebarProfileItem;
