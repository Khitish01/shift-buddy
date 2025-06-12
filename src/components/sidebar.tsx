'use client'

import { useSidebar } from "@/context/SidebarContext";
import { Calendar, ClipboardList, HelpCircle, Home, LogOut, Settings, Truck, Users } from "lucide-react";
import { useState } from "react";

const SideBar = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { isOpen, close } = useSidebar();
    const sidebarItems = [
        { icon: Home, label: 'Dashboard', id: 'dashboard' },
        { icon: Users, label: 'Staff', id: 'staff' },
        { icon: ClipboardList, label: 'Schedule', id: 'schedule' },
        { icon: Calendar, label: 'Calendar', id: 'calendar' },
        { icon: Truck, label: 'Vehicles', id: 'vehicles' },
        // { icon: Settings, label: 'Settings', id: 'settings' },
        // { icon: HelpCircle, label: 'Help', id: 'help' }
    ];
    return (
        < div className={`fixed left-0 top-0 h-full  bg-primary flex flex-col items-center py-4 z-50 rounded-br-3xl rounded-tr-3xl ${isOpen ? 'w-20 block' : 'w-0 hidden'}`} >
            {/* Logo */}
            < div className="w-10 h-10 rounded-lg flex items-center justify-center mb-8" >
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    {/* <span className="text-white text-xs font-bold">🐱</span> */}
                    <img src="/logos/logo.svg" alt="" />
                </div>
            </div >

            < nav className="flex flex-col justify-between space-y-3 h-full" >
                <div className="flex-1 flex flex-col space-y-3">
                    {
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
                    }
                </div>
                <div className="flex flex-col space-y-3">
                    <button

                        onClick={() => setActiveView('settings')}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'settings'
                            ? 'bg-white bg-opacity-20 text-primary'
                            : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                            }`}
                        title={'Settings'}
                    >
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={() => setActiveView('logout')}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'logout'
                            ? 'bg-white bg-opacity-20 text-primary'
                            : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                            }`}
                        title={'Logout'}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </nav >
        </div >
    );
}
export default SideBar;





