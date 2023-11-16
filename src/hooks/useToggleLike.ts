import { trpc } from "@/app/_trpc/client";
import usePost from "./usePost";
import useCurrentUser from "./useCurrentUser";
import { useCallback } from "react";
import toast from "react-hot-toast";
import useLoginModal from "./useLoginModal";
interface UseToggleLike {
  postId: string;
}
const useToggleLike = ({ postId }: UseToggleLike) => {
  const utils = trpc.useUtils();
  const loginModal = useLoginModal();
  const {
    mutate: toggleLikePost,
    isLoading,
    error,
  } = trpc.toggleLikePost.useMutation({
    onSuccess: () => {
      utils.getPost.invalidate();
      utils.getPosts.invalidate();
    },
  });
  const { data: post } = usePost({ postId });
  const { data: currentUser } = useCurrentUser();
  const isAllreadyLikedPost = useCallback(
    () => post?.likedIds.includes(currentUser?.id as string),
    [currentUser?.id, post?.likedIds],
  );
  const handleToggleLikePost = useCallback(() => {
    if (!currentUser?.id) {
      loginModal.open();
      return;
    }
    toggleLikePost({
      postId,
    });
  }, [currentUser?.id, loginModal, postId, toggleLikePost]);

  if (error) {
    toast.error("Something went wrong!");
  }
  return {
    handleToggleLikePost,
    isLoading,
    error,
    isAllreadyLikedPost: isAllreadyLikedPost(),
  };
};

export default useToggleLike;
