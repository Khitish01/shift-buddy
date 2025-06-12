'use client'

import Footer from "@/components/footer";
import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import { useSidebar } from "@/context/SidebarContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "../global.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// export const metadata: Metadata = {
//     title: "Organization Admin",
//     description: "This is the organization admin",
// };

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isOpen, isCollapse, collapse } = useSidebar()
    const isMobile = useIsMobile();
    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

            <div className="flex">
                <SideBar />
                <div className="">
                    <Header />
                    <main className={`pt-20 p-5  bg-[#fafafa] transition-all duration-300 ease-in-out ${isOpen && !isMobile ? !isCollapse ? 'pl-[19rem] w-[calc(100vw-1rem)]' : 'pl-24 w-[calc(100vw-1rem)]' : 'pl-5 w-[calc(100vw)]'}`}>

                        {children}
                    </main>
                </div>
            </div>

            {/* <Footer /> */}
        </div>

    );
}
