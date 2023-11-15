"use client";
import useNotifications from "@/hooks/useNotifications";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import ImageAvatar from "../ImageAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import useCurrentUser from "@/hooks/useCurrentUser";

const NotificationsFeed = () => {
  const { data: notifications = [], isLoading, error } = useNotifications();
  const { refetch: refetchCurrentUser } = useCurrentUser();
  useEffect(() => {
    refetchCurrentUser();
  }, [refetchCurrentUser]);
  if (error) {
    toast.error("Something went wrong!");
  }

  if (isLoading) {
    return (
      <div className="mt-12 grid place-items-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-2 lg:p-4">
      {notifications?.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center gap-2 border-b last:border-none"
          >
            <ImageAvatar
              userId={notification.user.id as string}
              fallback={notification.user.name[0]}
              imageUrl={notification.user.profileImage as string}
            />
            <p className="w-full">
              {`${notification.user.name} has ${
                notification.type === "FOLLOW"
                  ? "followed you."
                  : notification.type === "LIKE"
                  ? "liked your post."
                  : notification.type === "COMMENT"
                  ? "commented in your post."
                  : ""
              } 
`}{" "}
              <span className="text-xs text-gray-400 ml-auto">
                {formatDistanceToNowStrict(new Date(notification.createdAt))}{" "}
                ago
              </span>
            </p>
          </div>
        ))
      ) : (
        <h2 className="mt-12 text-center">Seems like empty!</h2>
      )}
    </div>
  );
};

export default NotificationsFeed;
