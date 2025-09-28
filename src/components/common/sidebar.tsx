'use client'

import { BookingIcon, CarrierIcon, DashBoardIcon, LeaveIcon, LogoutIcon, ParticipantIcon, SettingsIcon, ShiftIcon, VehicleIcon } from "@/app/images";
import { useSidebar } from "@/context/SidebarContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
    ArrowBigDown,
    BookCheck,
    Calendar,
    CalendarClock,
    ChevronRight,
    ClipboardList,
    Home,
    LogOut,
    Mail,
    Receipt,
    Settings,
    Truck,
    Users,
    X
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const SideBar = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { isOpen, isCollapse, collapse, toggle } = useSidebar();
    const isMobile = useIsMobile();
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        if (activeView == 'logout') {
            Cookies.remove('accessToken');
            Cookies.remove('role');
            // sessionStorage.clear()
            router.push('/');

        }
    }, [activeView])

    const sidebarItems = [
        { icon: DashBoardIcon, label: 'Home', id: 'dashboard', path: '/admin/dashboard' },
        { icon: BookingIcon, label: 'Booking Management', id: 'booking', path: '/admin/booking' },
        { icon: ParticipantIcon, label: 'Participant Management', id: 'participant', path: '/admin/participant' },
        { icon: CarrierIcon, label: 'Carer Management', id: 'carrier', path: '/admin/carrier' },
        { icon: ShiftIcon, label: 'Shift Management', id: 'shift', path: '/admin/shift' },
        { icon: LeaveIcon, label: 'Leave Management', id: 'leave', path: '/admin/leave' },
        { icon: VehicleIcon, label: 'Vehicle Management', id: 'vehicle', path: '/admin/vehicle' },
        { icon: CalendarClock, label: 'Time-Sheet Management', id: 'time-sheet', path: '/admin/time-sheet' },
        { icon: Receipt, label: 'Invoice Management', id: 'invoice', path: '/admin/invoice' },
        { icon: BookCheck, label: 'Service Pricing', id: 'service', path: '/admin/service' },
        { icon: Mail, label: 'Email Communication', id: 'email', path: '/admin/email' },
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
                                : 'w-68 opacity-100 px-4 rounded-br-3xl rounded-tr-3xl'
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
                <nav className="flex flex-col justify-between h-full overflow-auto scrollbar-hide">
                    <div className="flex flex-col space-y-2">
                        {isCollapse && !isMobile ? (
                            sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        router.push(item?.path)
                                        setActiveView(item.id)
                                    }}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${path.includes(item.id)
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-primary hover:bg-white hover:bg-opacity-10'
                                        }`}
                                    title={item.label}
                                >
                                    <item.icon className={`w-6 h-6`} />
                                    {/* <img src={item?.icon} alt="" className={`w-5 h-5 ${!path.includes(item.id) ? '' : 'filter invert sepia saturate-[500%] hue-rotate-[235deg] brightness-[95%] contrast-[87%]'}`} /> */}
                                </button>
                            ))
                        ) : (
                            sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        router.push(item?.path)
                                        setActiveView(item.id)
                                        isMobile ? toggle() : ''
                                    }}
                                    className={`flex items-center gap-4 mb-3 rounded-lg px-4 py-2 text-sm transition-colors w-full text-left ${path.includes(item.id)
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-primary hover:bg-white hover:bg-opacity-10'
                                        }`}
                                >
                                    <item.icon className={`w-6 h-6 `} />
                                    {/* <img src={item?.icon} alt="" className={`w-5 h-5 ${!path.includes(item.id) ? '' : 'filter invert sepia saturate-[500%] hue-rotate-[235deg] brightness-[95%] contrast-[87%]'}`} /> */}
                                    <span>{item.label}</span>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Settings and Logout */}
                    <div className="flex flex-col space-y-2 mt-6">
                        {['settings', 'logout'].map((key) => {
                            const Icon = key === 'settings' ? SettingsIcon : LogoutIcon;
                            const label = key === 'settings' ? 'Settings' : 'Logout';

                            return isCollapse && !isMobile ? (
                                <button
                                    key={key}
                                    onClick={() => setActiveView(key)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === key
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-primary hover:bg-white hover:bg-opacity-10'
                                        }`}
                                    title={label}
                                >
                                    <Icon className={`w-6 h-6`} />
                                </button>
                            ) : (
                                <button
                                    key={key}
                                    onClick={() => setActiveView(key)}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors w-full text-left ${activeView === key
                                        ? 'bg-white bg-opacity-20 text-primary'
                                        : 'text-purple-200 hover:text-primary hover:bg-white hover:bg-opacity-10'
                                        }`}
                                >
                                    <Icon size={20} className={`w-6 h-6 hover:text-primary`} />
                                    {/* <ArrowBigDown /> */}
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Collapse Toggle Button (Desktop only) */}
                {!isMobile && (
                    <div className={`fixed bottom-10 transition-all duration-300 ease-in-out ${isCollapse ? 'left-[3.8rem]' : 'left-[15.8rem]'}`}>
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
