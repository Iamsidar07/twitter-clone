import { trpc } from "@/app/_trpc/client";

const useSearchTwitter = (query: string) => {
  const { data, isLoading, error, mutate } = trpc.searchTwitter.useMutation();
  return { data, isLoading, error, mutate }
};
export default useSearchTwitter;
