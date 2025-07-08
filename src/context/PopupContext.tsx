'use client';

import { createContext, useContext, useState } from "react";

type PopupStatus = 'loading' | 'success' | 'error';

type PopupContextType = {
    popup: {
        visible: boolean;
        header?: string;
        message?: string;
        duration?: number;
        status: PopupStatus;
    };
    showPopup: (header?: string, message?: string, duration?: number) => void;
    updatePopupStatus: (status: PopupStatus, header?: string, message?: string, duration?: number) => void;
    hidePopup: () => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [popup, setPopup] = useState({
        visible: false,
        header: '',
        message: '',
        duration: 3000,
        status: 'loading' as PopupStatus,
    });

    const showPopup = (header = '', message = '', duration = 3000) => {
        setPopup({ visible: true, header, message, duration, status: 'loading' });
    };

    const updatePopupStatus = (status: PopupStatus, header?: string, message?: string, duration?: number) => {
        setPopup(prev => ({
            ...prev,
            status,
            header: header ?? prev.header,
            message: message ?? prev.message,
            duration: duration ?? prev.duration,
        }));
    };

    const hidePopup = () => {
        setPopup(prev => ({ ...prev, visible: false }));
    };

    return (
        <PopupContext.Provider value={{ popup, showPopup, updatePopupStatus, hidePopup }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) throw new Error("usePopup must be used within a PopupProvider");
    return context;
};
