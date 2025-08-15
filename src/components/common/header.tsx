'use client'
import { CalendarIcon, ChatIcon, NotificationIcon } from "@/app/images";
import { useSidebar } from "@/context/SidebarContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Bell, Calendar, Menu, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SideDrawer } from "./SIdeDrawer";
import ChatComponent from "../chat/ChatComponent";
import ChatDetails from "../chat/ChatDetails";
import NotificationComponent from "../notification/NotificationComponent";
import { Conversation } from "@/context/ChatSocketContext";

const Header = () => {
    const router = useRouter();
    const path = usePathname();
    const { isOpen, isCollapse, toggle, collapse } = useSidebar();
    const isMobile = useIsMobile();


    const [showNotification, setShowNotification] = useState<boolean>(false)
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        selectedChat: null as null | Conversation,
    });

    const openDrawer = () => {
        console.log('asdfgsagdhfjsfdhgsdfvhgsdfhsgdfvhg');

        setDrawerState({
            isOpen: true,
            selectedChat: null,
        });
    };

    const closeDrawer = () => {
        setShowNotification(false)
        setDrawerState(prev => ({ ...prev, isOpen: false, selectedChat: null }));
    };

    const handleChatSelect = (chat: any) => {
        setDrawerState(prev => ({
            ...prev,
            selectedChat: chat,
        }));
    };

    const handleBackToChatList = () => {
        setDrawerState(prev => ({
            ...prev,
            selectedChat: null,
        }));
    };


    return (
        <header className={`fixed top-0 right-0  bg-white border-b border-gray-200 px-6 py-4 z-40 transition-all duration-300 ease-in-out ${isOpen && !isMobile ? !isCollapse ? 'left-[15.5rem]' : 'left-[4.5rem]' : 'left-0'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* <p className="text-xl font-semibold text-primary flex flex-col">
                        <span>Shift</span><span >Buddy</span>
                    </p> */}
                    <button onClick={toggle} className="md:hidden">
                        <Menu size={24} />
                    </button>
                    <img src="/logos/logo-text.svg" alt="" />
                </div>

                <div className="flex items-center space-x-4 z-60">
                    {/* Search */}
                    {/* <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Type to search"
                            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div> */}

                    {/* Icons */}
                    <button className={`p-1 rounded-md hover:text-primary text-black ${path.includes('scheduler') ? 'bg-[#69417E1C] text-primary' : ''}`} onClick={() => router.push('/admin/scheduler')}>
                        <CalendarIcon className='w-6 h-6 ' />
                    </button>
                    <button className="p-1 rounded-md hover:text-primary relative text-black"
                        onClick={openDrawer}
                    //  onClick={() => router.push('/admin/chat')}
                    >
                        <ChatIcon className='w-6 h-6' />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">1</span>
                    </button>
                    <button className="p-1 rounded-md hover:text-primary relative text-black"
                        onClick={() => setShowNotification(true)}
                    >
                        <NotificationIcon className='w-6 h-6' />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">1</span>
                    </button>

                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                        <img
                            src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <SideDrawer
                isOpen={drawerState.isOpen}
                onClose={closeDrawer}
                avatar={drawerState.selectedChat?.profileImage || ''}
                title={drawerState.selectedChat?.name || 'Chats'}
                isBackButton={!!drawerState.selectedChat}
                onBack={drawerState.selectedChat ? handleBackToChatList : undefined}
            >
                <ChatComponent
                    selectedChat={drawerState.selectedChat}
                    onSelectChat={handleChatSelect}
                    onBack={handleBackToChatList}
                />
            </SideDrawer>
            <SideDrawer
                isOpen={showNotification}
                onClose={closeDrawer}
                avatar={''}
                title={'Notifications'}

            >
                <NotificationComponent />
            </SideDrawer>
        </header>
    );
}
export default Header;