"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import { FeatherIcon } from "lucide-react";
import React, { useCallback } from "react";
import { Button, buttonVariants } from "../ui/button";

const SidebarTweetButton = () => {
  const loginModal = useLoginModal();
  const { data: user } = useCurrentUser();
  const hanldeTweetClick = useCallback(() => {
    if (!user) {
      loginModal.open();
    }
    // Open new tweet model
  }, [loginModal, user]);
  return (
    <div
      onClick={hanldeTweetClick}
      className="text-white hover:text-black cursor-pointer"
    >
      <div className="relative w-8 h-8 flex items-center mt-4 justify-center lg:hidden bg-blue-500 rounded-full mx-auto">
        <FeatherIcon className="absolute" />
      </div>
      <Button
        className={buttonVariants({
          size: "lg",
          className:
            "hidden lg:block bg-primary w-full rounded-full dark:hover:bg-dark2",
        })}
      >
        Tweet
      </Button>
    </div>
  );
};

export default SidebarTweetButton;
