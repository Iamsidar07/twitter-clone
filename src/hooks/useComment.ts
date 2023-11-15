import { trpc } from "@/app/_trpc/client";
import { useCallback } from "react";
import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
interface UseCommentProps {
  postId: string;
}
const useComment = ({ postId }: UseCommentProps) => {
  const utils = trpc.useUtils();
  const {
    mutate: postComment,
    isLoading,
    error,
  } = trpc.comment.useMutation({
    onSuccess: () => {
      utils.getPost.invalidate({ postId });
    },
  });
  const loginModal = useLoginModal();
  const { data: currentUser } = useCurrentUser();
  const handlePostComment = useCallback(
    ({ postId, body }: { postId: string; body: string }) => {
      if (!postId) return;
      if (!currentUser?.id) {
        loginModal.open();
        return;
      }
      postComment({
        postId,
        body,
      });
    },
    [currentUser?.id, loginModal, postComment],
  );
  return {
    handlePostComment,
    isLoading,
    error,
  };
};

export default useComment;
