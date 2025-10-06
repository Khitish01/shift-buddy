'use client'

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import SideBar from "@/components/common/sidebar";
import { useSidebar } from "@/context/SidebarContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "../global.css";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isOpen, isCollapse, collapse } = useSidebar()
    const isMobile = useIsMobile();
    return (

        <div className="flex">
            <SideBar />
            <div className="">
                <Header />
                <main className={`pt-20 p-5  bg-white transition-all duration-300 ease-in-out ${isOpen && !isMobile ? !isCollapse ? 'pl-[18rem] w-[calc(100vw-1.5rem)]' : 'pl-24 w-[calc(100vw-1.5rem)]' : 'pl-5 w-[calc(100vw)]'}`}>

                    {children}
                </main>
            </div>
        </div>


    );
}
