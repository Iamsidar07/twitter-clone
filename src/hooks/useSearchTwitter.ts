import { trpc } from "@/app/_trpc/client";

const useSearchTwitter = (query: string) => {
  const { data, isLoading, error, refetch } = trpc.searchTwitter.useQuery(
    { query },
  );
  return { data, isLoading, error, refetch }
};
export default useSearchTwitter;
