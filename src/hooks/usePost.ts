import { trpc } from "@/app/_trpc/client";

interface UsePostProps {
  postId: string;
}
const usePost = ({ postId }: UsePostProps) => {
  const { data, isLoading, error } = trpc.getPost.useQuery({ postId });
  return { data, isLoading, error };
};

export default usePost;
