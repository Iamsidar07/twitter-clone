"use client";
import React, { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";

interface ImageAvatarProps {
  userId: string;
  size?: "sm" | "lg";
  outline?: boolean;
  imageUrl: string;
  fallback: string;
}
const ImageAvatar: React.FC<ImageAvatarProps> = ({
  userId,
  size,
  outline,
  imageUrl,
  fallback,
}) => {
  const router = useRouter();
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      router.push(`/user/${userId}`);
    },
    [router, userId],
  );
  return (
    <Avatar
      onClick={handleClick}
      className={`
      ${size === "sm" ? "w-10 h-10" : size === "lg" ? "w-32 h-32" : ""}
      ${outline ? "border-4" : ""}
      relative cursor-pointer
    `}
    >
      <AvatarImage src={imageUrl ?? "/placeholder.png"} alt={"profile image"} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default ImageAvatar;
