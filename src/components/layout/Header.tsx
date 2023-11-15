"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
interface FeedHeaderProps {
  label: ReactNode;
  back?: boolean;
}
const Header: React.FC<FeedHeaderProps> = ({ label, back }) => {
  const router = useRouter();
  return (
    <header className="w-full flex items-center justify-start space-x-4 relative px-2 py-3  bg-white dark:bg-dark border-b">
      {back ? (
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
      ) : null}
      <div className="text-center">{label}</div>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
