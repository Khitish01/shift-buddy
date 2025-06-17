// context/PopupContext.tsx
'use client';

import { createContext, useContext, useState } from "react";

type PopupContextType = {
    popup: {
        visible: boolean;
        message?: string;
        duration?: number;
    };
    showPopup: (message?: string, duration?: number) => void;
    hidePopup: () => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [popup, setPopup] = useState({ visible: false, message: "", duration: 3000 });

    const showPopup = (message = "", duration = 3000) => {
        setPopup({ visible: true, message, duration });
    };

    const hidePopup = () => {
        setPopup({ ...popup, visible: false });
    };

    return (
        <PopupContext.Provider value={{ popup, showPopup, hidePopup }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) throw new Error("usePopup must be used within a PopupProvider");
    return context;
};
