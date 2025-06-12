'use client'
import { useSidebar } from "@/context/SidebarContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Bell, Calendar, Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();
    const { isOpen, isCollapse, toggle, collapse } = useSidebar();
    const isMobile = useIsMobile();
    return (
        <header className={`fixed top-0 right-0  bg-white border-b border-gray-200 px-6 py-4 z-40 transition-all duration-300 ease-in-out ${isOpen && !isMobile ? !isCollapse ? 'left-[17.5rem]' : 'left-[4.5rem]' : 'left-0'}`}>
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

                <div className="flex items-center space-x-4">
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
                    <button className="p-2 text-gray-400 hover:text-gray-600" onClick={() => router.push('/admin/scheduler')}>
                        <Calendar size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">1</span>
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
        </header>
    );
}
export default Header;