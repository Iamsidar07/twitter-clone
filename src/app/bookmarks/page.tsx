import BookmarkFeed from "@/components/bookmark/BookmarkFeed";
import Header from "@/components/layout/Header";
import React from "react";

const BookmarkPage = () => {
  return (
    <>
      <Header label={"Bookmarks"} back />
      <BookmarkFeed />
    </>
  );
};

export default BookmarkPage;
