import { Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const SidebarLogo = () => {
  return (
    <Link
      href={"/"}
      className="w-14 h-14 flex flex-col items-center justify-center cursor-pointer "
    >
      <Twitter className="text-blue-500" />
    </Link>
  );
};

export default SidebarLogo;
