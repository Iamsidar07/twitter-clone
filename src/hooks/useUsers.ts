import { trpc } from "@/app/_trpc/client";

const useUsers = () => {
  const { data: users, isLoading, error } = trpc.getAllUser.useQuery();
  return { users, isLoading, error };
};

export default useUsers;
