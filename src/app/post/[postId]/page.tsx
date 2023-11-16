import PostDetail from "@/components/feed/PostDetail";
import Header from "@/components/layout/Header";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = constructMetadata({
  title: "Tweet",
});

interface PostDetailPage {
  params: {
    postId: string;
  };
}
const PostDetailPage = ({ params }: PostDetailPage) => {
  const { postId } = params;

  return (
    <>
      <Header label={"Tweet"} back />
      <PostDetail postId={postId} />
    </>
  );
};

export default PostDetailPage;
