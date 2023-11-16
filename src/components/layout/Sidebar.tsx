"use client";
import { Bell, Bookmark, Home, LogIn, LogOut, User } from "lucide-react";
import React from "react";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarProfileItem from "./SidebarProfileItem";
import SidebarTweetButton from "./SidebarTweetButton";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";

interface Icon {
  label: string;
  href?: string;
  icon: React.ReactElement;
  isProtected?: boolean;
  alert?: boolean;
}

const Sidebar = () => {
  const { data: user } = useCurrentUser();
  const loginModal = useLoginModal();
  const icons: Icon[] = [
    {
      label: "Home",
      href: "/",
      icon: <Home />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Bell />,
      isProtected: true,
      alert: user?.hashNotifications as boolean,
    },
    {
      label: "Bookmarks",
      href: "/bookmarks",
      icon: <Bookmark />,
      isProtected: true,
      alert: user?.hashNotifications as boolean,
    },
    {
      label: "Profile",
      href: `/user/${user?.id}`,
      icon: <User />,
      isProtected: true,
    },
  ];
  return (
    <div className="w-fit lg:w-full lg:col-span-1 p-0 h-screen md:pr-6 sticky top-0 bottom-0">
      <div className="flex flex-col items-center lg:items-start justify-between h-full pb-6">
        <div className="space-y-2 lg:w-[250px]">
          <SidebarLogo />
          {icons.map((icon, i) => (
            <SidebarItem {...icon} key={i} />
          ))}
          {user ? (
            <SidebarItem
              icon={<LogOut />}
              label="Logout"
              onClick={() => signOut()}
            />
          ) : (
            <SidebarItem
              icon={<LogIn />}
              label={"Login"}
              onClick={() => loginModal.open()}
            />
          )}
          <SidebarTweetButton />
        </div>
        {user ? <SidebarProfileItem /> : null}
      </div>
    </div>
  );
};

export default Sidebar;
