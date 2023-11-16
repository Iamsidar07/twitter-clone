import BookmarkFeed from "@/components/bookmark/BookmarkFeed";
import Header from "@/components/layout/Header";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = constructMetadata({
  title: "Bookmarks",
});

const BookmarkPage = () => {
  return (
    <>
      <Header label={"Bookmarks"} back />
      <BookmarkFeed />
    </>
  );
};

export default BookmarkPage;
