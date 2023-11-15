import { trpc } from "@/app/_trpc/client";

const useCurrentUser = () => {
  const { data, error, isLoading, refetch } = trpc.currentUser.useQuery();
  return { data, error, isLoading, refetch };
};

export default useCurrentUser;
