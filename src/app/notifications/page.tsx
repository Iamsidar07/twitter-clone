import Header from "@/components/layout/Header";
import NotificationsFeed from "@/components/notifications/NotificationsFeed";

const NotificationsPage = () => {
  return (
    <>
      <Header label="Notifications" back />
      <NotificationsFeed />
    </>
  );
};

export default NotificationsPage;
