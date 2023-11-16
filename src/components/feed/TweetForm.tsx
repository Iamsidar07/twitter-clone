"use client";
import { ImageIcon } from "lucide-react";
import React, { FormEvent, useCallback, useState } from "react";
import { Button } from "../ui/button";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import ImageAvatar from "../ImageAvatar";
import ImageUpload from "../ImageUpload";

const TweetForm = () => {
  const utils = trpc.useUtils();
  const { data: user } = useCurrentUser();
  const loginModal = useLoginModal();
  const [tweetContent, setTweetContent] = useState("");
  const [image, setImage] = useState("");

  const {
    mutate: createPost,
    error,
    isLoading,
  } = trpc.createPost.useMutation({
    onSuccess: () => {
      toast.success("successfully tweet.");
      setTweetContent("");
      setImage("");
      utils.getPosts.invalidate();
    },
  });
  const hanldlePostTweet = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Do some logic to post tweet
      if (user) {
        createPost({
          body: tweetContent,
          imageContent: image,
        });
      } else {
        loginModal.open();
      }
    },
    [createPost, image, loginModal, tweetContent, user],
  );

  if (error) {
    toast.error("Failed share tweet.");
  }

  return (
    <form
      onSubmit={hanldlePostTweet}
      className="flex items-start w-full border-b px-2 py-3 bg-white dark:bg-dark"
    >
      <ImageAvatar
        imageUrl={user?.profileImage as string}
        fallback={user?.name[0] as string}
        userId={user?.id as string}
      />
      <div className="flex flex-col flex-1 ml-1.5">
        <textarea
          className="border-none outline-none px-2 py-3 h-full w-full resize-none min-h-[60px] bg-transparent"
          placeholder={`${
            user?.name ? `Hey ${user.name}!` : ""
          } What's happening?`}
          spellCheck={false}
          rows={3}
          maxLength={255}
          value={tweetContent}
          disabled={isLoading}
          onChange={(e) => setTweetContent(e.target.value)}
        />
        <div className="flex items-end gap-1.5 justify-between mt-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <ImageUpload
              value={image}
              label={<ImageIcon className="cursor-pointer" />}
              disabled={isLoading}
              onChange={(image) => setImage(image)}
            />
          </div>
          <Button type="submit" className="rounded-full" disabled={isLoading}>
            Tweet
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TweetForm;
