import { trpc } from "@/app/_trpc/client";

const useBookmark = () => {
  const { data: bookmarks, isLoading, error } = trpc.getBookmark.useQuery();
  return { bookmarks, isLoading, error };
};

export default useBookmark;
