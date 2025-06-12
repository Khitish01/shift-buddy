'use client'

import { useSidebar } from "@/context/SidebarContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
    Calendar,
    ChevronRight,
    ClipboardList,
    Home,
    LogOut,
    Settings,
    Truck,
    Users,
    X
} from "lucide-react";
import { useState } from "react";

const SideBar = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { isOpen, isCollapse, collapse ,toggle} = useSidebar();
    const isMobile = useIsMobile();

    const sidebarItems = [
        { icon: Home, label: 'Dashboard', id: 'dashboard' },
        { icon: Users, label: 'Staff', id: 'staff' },
        { icon: ClipboardList, label: 'Schedule', id: 'schedule' },
        { icon: Calendar, label: 'Calendar', id: 'calendar' },
        { icon: Truck, label: 'Vehicles', id: 'vehicles' },
    ];
    return (
        <div className="relative z-50">
            <div
                className={`fixed top-0 left-0 h-full bg-primary flex flex-col py-4 transition-all duration-300 ease-in-out overflow-hidden
                ${isOpen
                        ? isMobile
                            ? 'w-full opacity-100 rounded-none px-4'
                            : isCollapse
                                ? 'w-20 opacity-100 px-2 items-center rounded-br-3xl rounded-tr-3xl'
                                : 'w-72 opacity-100 px-4 rounded-br-3xl rounded-tr-3xl'
                        : 'w-0 opacity-0'
                    }`}
            >
                {/* Mobile Close Button */}
                {isMobile && (
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3 ">
                            <img src="/logos/logo.svg" alt="Logo" className="w-8 h-8" />
                            <span className="text-white font-semibold text-lg">Shift-Buddy</span>
                        </div>
                        <button
                            onClick={toggle}
                            className="text-white p-2 rounded hover:bg-white hover:bg-opacity-10 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Desktop Logo */}
                {!isMobile && (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-8">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <img src="/logos/logo.svg" alt="Logo" />
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex flex-col justify-between h-full">
                    <div className="flex flex-col space-y-2">
                        {isCollapse && !isMobile ? (
                            sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveView(item.id)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === item.id
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                                        }`}
                                    title={item.label}
                                >
                                    <item.icon size={18} />
                                </button>
                            ))
                        ) : (
                            sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveView(item.id)}
                                    className={`flex items-center gap-4 mb-3 rounded-lg px-4 py-2 text-sm transition-colors w-full text-left ${activeView === item.id
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Settings and Logout */}
                    <div className="flex flex-col space-y-2 mt-6">
                        {['settings', 'logout'].map((key) => {
                            const Icon = key === 'settings' ? Settings : LogOut;
                            const label = key === 'settings' ? 'Settings' : 'Logout';

                            return isCollapse && !isMobile ? (
                                <button
                                    key={key}
                                    onClick={() => setActiveView(key)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === key
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                                        }`}
                                    title={label}
                                >
                                    <Icon size={20} />
                                </button>
                            ) : (
                                <button
                                    key={key}
                                    onClick={() => setActiveView(key)}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors w-full text-left ${activeView === key
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Collapse Toggle Button (Desktop only) */}
                {!isMobile && (
                    <div className={`fixed bottom-10 transition-all duration-300 ease-in-out ${isCollapse ? 'left-[3.8rem]' : 'left-[16.8rem]'}`}>
                        <button
                            className="bg-[#F2C7AC] font-bold h-10 w-10 flex items-center justify-center rounded-full"
                            onClick={collapse}
                        >
                            <ChevronRight className={`${!isCollapse ? 'rotate-180' : ''} transition-transform`} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
