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
    title: "Staff",
    description: "This is the staff",
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

            <Header />
            <div className="flex">
                <SideBar />
                {children}
            </div>

            <Footer />
        </div>

    );
}
