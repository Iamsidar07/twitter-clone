import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Followbar from "@/components/layout/Followbar";
import LoginModal from "@/modals/LoginModal";
import RegisterModal from "@/modals/RegisterModal";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import EditProfileModal from "@/modals/EditProfileModal";
import { authOptions } from "./api/auth/[...nextauth]/route";
import CustomThemeProvider from "@/components/CustomThemeProvider";
import { constructMetadata } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <Providers session={session!}>
        <body className={`${inter.className} h-screen`}>
          <CustomThemeProvider>
            <Toaster />
            <LoginModal />
            <RegisterModal />
            <EditProfileModal />
            <div className="lg:container mx-auto xl:px-6 max-w-7xl">
              <div className="grid grid-cols-4 h-full">
                <Sidebar />
                <div className="col-span-3 lg:col-span-2 border-x-[1px]">
                  {children}
                </div>
                <Followbar />
              </div>
            </div>
          </CustomThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
