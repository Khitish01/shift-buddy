// src/components/ClientProviders.tsx
"use client";

import { TopLoaderProvider } from "@/context/TopLoader";
import { SidebarProvider } from "@/context/SidebarContext";
import ConfirmationPopup from "@/components/common/ConfirmationPopup";
import { PopupProvider } from "@/context/PopupContext";
import { Toaster } from "react-hot-toast";
import { ChatSocketProvider } from "@/context/ChatSocketContext";
import { LoadScript } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
            libraries={libraries}
            loadingElement={<div className="w-full h-full" />}
        >
            <TopLoaderProvider>
                <PopupProvider>
                    <SidebarProvider>
                        <ChatSocketProvider>
                            {children}
                            <Toaster position="bottom-right" />
                            <ConfirmationPopup />
                        </ChatSocketProvider>
                    </SidebarProvider>
                </PopupProvider>
            </TopLoaderProvider>
        </LoadScript>
    );
}
