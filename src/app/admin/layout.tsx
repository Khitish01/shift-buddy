import Footer from "@/components/footer";
import Header from "@/components/header";
import SideBar from "@/components/sidebar";
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

export const metadata: Metadata = {
    title: "Organization Admin",
    description: "This is the organization admin",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

            <div className="flex">
                <SideBar />
                <div className="">
                    <Header />
                    <main className="pt-20 pl-24 p-5 w-[calc(100vw-1rem)] bg-[#fafafa]">

                        {children}
                    </main>
                </div>
            </div>

            {/* <Footer /> */}
        </div>

    );
}
