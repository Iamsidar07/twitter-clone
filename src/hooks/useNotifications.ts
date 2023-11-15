import { trpc } from "@/app/_trpc/client";

const useNotifications = () => {
  const { data, isLoading, error } = trpc.getNotifications.useQuery();
  return { data, isLoading, error };
};
export default useNotifications;
