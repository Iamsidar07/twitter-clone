import { trpc } from "@/app/_trpc/client";
import useCurrentUser from "./useCurrentUser";
import useUser from "./useUser";
import toast from "react-hot-toast";
import { useCallback } from "react";

interface UseToggleFollowProps {
  userId: string;
}

const useToggleFollow = ({ userId }: UseToggleFollowProps) => {
  const utils = trpc.useUtils();
  const { data: currentUser } = useCurrentUser();
  const { data } = useUser({ userId });
  const {
    mutate: toggleFollow,
    isLoading,
    error,
  } = trpc.toggleFollow.useMutation({
    onSuccess: () => {
      toast.success("success");
      utils.getUser.invalidate();
    },
  });
  const isFollowing = useCallback(
    () => data?.user?.followingIds.includes(currentUser?.id as string),
    [data?.user?.followingIds, currentUser?.id],
  );

  const handleToggleFollow = useCallback(() => {
    if (isLoading) return;
    toggleFollow({ userIdToToggleFollow: userId });
  }, [isLoading, toggleFollow, userId]);

  if (error) {
    toast.error("Something went wrong!");
  }

  return { error, isLoading, handleToggleFollow, isFollowing: isFollowing() };
};

export default useToggleFollow;
