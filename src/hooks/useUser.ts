import { trpc } from "@/app/_trpc/client";

const useUser = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = trpc.getUser.useQuery({ userId });
  return { data, isLoading, error };
};

export default useUser;
