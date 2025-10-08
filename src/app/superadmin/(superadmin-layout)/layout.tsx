
import Layout from "@/components/layout/Layout";
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
    title: "Super Admin",
    description: "This is the shift buddy super admin",
};

export default function SuperAdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

            <Layout>{children}</Layout>

        </div>

    );
}
