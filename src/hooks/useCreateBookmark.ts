import { trpc } from "@/app/_trpc/client";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import useLoginModal from "./useLoginModal";
import toast from "react-hot-toast";

const useCreateBookmark = () => {
  const utils = trpc.useUtils();
  const session = useSession();
  const loginModal = useLoginModal();
  const { mutate, isLoading, error } = trpc.createBookmark.useMutation({
    onSuccess: () => {
      toast.success("success");
      utils.getNotifications.invalidate();
    },
  });
  const handleCreateBookmark = useCallback(
    ({ postId }: { postId: string }) => {
      if (!session.data?.user.id) {
        loginModal.open();
        return;
      }
      mutate({
        postId,
      });
    },
    [loginModal, mutate, session.data?.user.id],
  );
  if (error) {
    toast.error("Something went wrong!");
  }
  return { handleCreateBookmark, isLoading, error };
};
export default useCreateBookmark;
