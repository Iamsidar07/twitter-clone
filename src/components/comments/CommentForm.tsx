"use client";
import React, { FormEvent, useCallback, useState } from "react";
import ImageAvatar from "../ImageAvatar";
import useCurrentUser from "@/hooks/useCurrentUser";
import useComment from "@/hooks/useComment";
import { ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import Image from "next/image";

// It's happening

interface CommentFormProps {
  postId: string;
}
const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const { data: user } = useCurrentUser();
  const { handlePostComment, error, isLoading } = useComment({ postId });
  const [commentBody, setCommentBody] = useState("");
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handlePostComment({ postId, body: commentBody });
      setCommentBody("");
    },
    [commentBody, handlePostComment, postId],
  );

  if (error) {
    console.log({ error });
    toast.error("Something went wrong!");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start w-full border-b px-2 py-3 bg-white"
    >
      <ImageAvatar
        imageUrl={user?.profileImage as string}
        fallback={user?.name[0] as string}
        userId={user?.id as string}
      />
      <div className="flex flex-col flex-1 ml-1.5">
        <textarea
          className="border-none outline-none px-2 py-3 h-full w-full resize-none min-h-[60px] bg-transparent"
          placeholder={"What's your thought on this?"}
          spellCheck={false}
          rows={2}
          maxLength={255}
          value={commentBody}
          disabled={isLoading}
          onChange={(e) => setCommentBody(e.target.value)}
        />
        <div className="flex items-center justify-between mt-2">
          <Button
            type="submit"
            className="rounded-full bg-blue-400"
            disabled={isLoading}
          >
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
