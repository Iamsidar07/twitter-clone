import TweetFeed from "@/components/feed/TweetFeed";
import Header from "@/components/layout/Header";
import UserBio from "@/components/user/UserBio";
import UserHero from "@/components/user/UserHero";
import { db } from "@/db";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = constructMetadata({
  title: "Profile",
});
interface ProfilePageProps {
  params: {
    userId: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { userId } = params;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  const followingCount = await db.user.count({
    where: {
      followingIds: {
        has: userId,
      },
    },
  });

  const followerCount = user?.followingIds.length;

  if (!user) return null;

  return (
    <>
      <Header label={user?.name} back />
      <UserHero userId={userId} />
      <UserBio
        userId={userId}
        followerCount={followerCount ?? 0}
        followingCount={followingCount ?? 0}
        createdAt={user?.createdAt}
        name={user?.name}
        username={user.username}
        bio={user.bio}
      />
      <TweetFeed userId={userId} />
    </>
  );
};

export default ProfilePage;
