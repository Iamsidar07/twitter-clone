"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import { Dot } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback } from "react";
interface SidebarItemProps {
  label: string;
  href?: string;
  icon: ReactNode;
  onClick?: () => void;
  isProtected?: boolean;
  alert?: boolean;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon,
  onClick,
  isProtected,
  alert,
}) => {
  const { data: currentUser } = useCurrentUser();
  const loginModal = useLoginModal();
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }
    if (isProtected && !currentUser) {
      loginModal.open();
    } else if (href) {
      router.push(href);
    }
  }, [currentUser, href, isProtected, loginModal, onClick, router]);
  return (
    <div
      className="flex flex-row items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative w-14 h-14 flex items-center justify-center px-4 py-3 lg:hidden hover:bg-blue-300 dark:hover:bg-dark2 hover:bg-opacity-30 transition rounded-full">
        {icon}
        {alert ? (
          <Dot
            className="w-12 h-12 absolute bottom-3 left-0 text-2xl text-sky-500"
            size={90}
          />
        ) : null}
      </div>

      {href ? (
        <div className=" relative hidden lg:flex gap-4  items-center px-4 py-3 hover:bg-blue-300 hover:bg-opacity-30 dark:hover:bg-dark2 transition rounded-full w-full">
          {icon}
          <span>{label}</span>

          {alert ? (
            <Dot
              className="w-12 h-12 absolute bottom-3 left-0 text-2xl text-sky-500"
              size={90}
            />
          ) : null}
        </div>
      ) : (
        <div className="relative hidden lg:flex gap-4  items-center px-4 py-3 hover:bg-blue-300 dark:hover:bg-dark2 hover:bg-opacity-30 transition rounded-full w-full">
          {icon}
          <span>{label}</span>
          {alert ? (
            <Dot
              className="w-12 h-12 absolute bottom-3 left-0 text-2xl text-sky-500"
              size={90}
            />
          ) : null}{" "}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
