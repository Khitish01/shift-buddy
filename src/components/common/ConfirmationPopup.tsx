'use client';

import { useEffect } from "react";
import { usePopup } from "@/context/PopupContext";
import { CheckCircle, XCircle } from "lucide-react";

const ConfirmationPopup = () => {
    const { popup, hidePopup } = usePopup();

    useEffect(() => {
        let hideTimer: NodeJS.Timeout;

        if (popup.visible && popup.status !== 'loading') {
            hideTimer = setTimeout(() => hidePopup(), popup.duration || 3000);
        }

        return () => clearTimeout(hideTimer);
    }, [popup.status, popup.visible]);

    if (!popup.visible) return null;

    return (
        <>
            <div
                className="fixed inset-0 h-screen w-screen bg-black z-[110] opacity-70 transition-opacity duration-300"
                onClick={hidePopup}
            />

            <div className="fixed inset-0 z-[111] flex items-center justify-center pointer-events-none">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[300px] pointer-events-auto animate-scaleIn">
                    <div className="flex justify-center mb-3 h-10">
                        {popup.status === 'loading' ? (
                            <div className="border-t-4 border-primary border-solid rounded-full w-6 h-6 animate-spin" />
                        ) : popup.status === 'success' ? (
                            <CheckCircle className="text-primary w-8 h-8 animate-checkFadeIn" />
                            // <img src="/icons/Tick Circle.svg" alt="" className="w-8 h-8 animate-checkFadeIn" />
                        ) : (
                            <XCircle className="text-primary w-8 h-8 animate-checkFadeIn" />
                        )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">{popup.header || 'Status'}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {popup.message || ''}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ConfirmationPopup;
