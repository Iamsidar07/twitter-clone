import Header from "@/components/layout/Header";
import NotificationsFeed from "@/components/notifications/NotificationsFeed";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Notifications",
});

const NotificationsPage = () => {
  return (
    <>
      <Header label="Notifications" back />
      <NotificationsFeed />
    </>
  );
};

export default NotificationsPage;
