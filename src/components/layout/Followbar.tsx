"use client";
import React from "react";
import FollowbarItem from "./FollowbarItem";
import useUsers from "@/hooks/useUsers";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const Followbar = () => {
  const { users, isLoading, error } = useUsers();
  if (error) {
    toast.error("Something went wrong!");
  }
  return (
    <div className="px-2 pt-3 hidden lg:block border-r col-span-1">
      <h2 className="font-bold text-lg">Who to follow</h2>
      <div className="bg-gray-100 dark:bg-dark rounded-lg py-2 mt-6 border">
        {users && users?.length >= 0
          ? users?.map((user) => (
              <FollowbarItem
                userId={user.id}
                key={user.id}
                name={user.name}
                profileImage={user.profileImage!}
                username={user.username}
              />
            ))
          : null}
        {isLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : null}
      </div>
    </div>
  );
};

export default Followbar;
