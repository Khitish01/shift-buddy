// components/ConfirmationPopup.tsx
'use client';

import { useEffect, useState } from "react";
import { usePopup } from "@/context/PopupContext";
import { CheckCircle } from "lucide-react";

const ConfirmationPopup = () => {
    const { popup, hidePopup } = usePopup();
    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        if (popup.visible) {
            // Reset check state
            setShowCheck(false);

            // Timer for hiding popup
            const hideTimer = setTimeout(() => hidePopup(), popup.duration || 3000);

            // Timer for switching from loader to check
            const checkTimer = setTimeout(() => setShowCheck(true), 1500);

            return () => {
                clearTimeout(hideTimer);
                clearTimeout(checkTimer);
            };
        }
    }, [popup]);

    if (!popup.visible) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 h-screen w-screen bg-black z-[110] opacity-70 transition-opacity duration-300"
                onClick={hidePopup}
            />

            {/* Popup */}
            <div className="fixed inset-0 z-[111] flex items-center justify-center pointer-events-none">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[300px] pointer-events-auto animate-scaleIn">
                    <div className="flex justify-center mb-3 h-10">
                        {!showCheck ? (
                            <div className="border-t-4 border-primary border-solid rounded-full w-6 h-6 animate-spin" />
                        ) : (
                            <div className="animate-checkFadeIn">
                                <CheckCircle className="text-primary w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Booking Confirmed!</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {popup.message || 'Congratulations, booking has been confirmed.'}
                    </p>
                </div>
            </div>
        </>
    );
};


export default ConfirmationPopup;
