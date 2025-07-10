'use client'

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const UnAuthorized = () => {
    const user = {
        name: "Khitish Mangal",
        email: "khitish@example.com",
        avatar: "https://ui-avatars.com/api/?name=Khitish+Mangal&background=69417E&color=fff"
    };

    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            {/* 401 Key Illustration (SVG embedded inline) */}
            <div className="relative text-center mb-8">
                <h1 className="text-[160px] font-bold text-[#69417E]/10 leading-none select-none">
                    401
                </h1>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* SVG Key Icon */}
                    <svg
                        width="160"
                        height="60"
                        viewBox="0 0 100 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <linearGradient id="keyGradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#69417E" />
                            <stop offset="1" stopColor="#A374C3" />
                        </linearGradient>
                        <path
                            d="M20 20a8 8 0 1 0 0.01 0zM28 20h40v6h4v4h4v-4h4v10h-12v-4h-4v-4h-4v4h-4v-6H28z"
                            fill="url(#keyGradient)"
                        />
                    </svg>
                </div>
            </div>

            {/* Message */}
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-semibold text-primary mb-2">
                    No authorization found.
                </h2>
                <p className="text-gray-500 mb-6">
                    This page is not publically available.<br />
                    To access it please login first.
                </p>
                <a
                    href="javascript:void(0);"
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gradient-to-r from-[#69417E] to-[#A374C3] text-white font-semibold rounded-full shadow-md hover:opacity-90 transition"
                >
                    RETURN BACK
                </a>
            </div>
        </div>
    );
}

export default UnAuthorized;