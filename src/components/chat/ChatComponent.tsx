'use client'
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import ChatDetails from "./ChatDetails";

const ChatComponent = ({
    selectedChat,
    onSelectChat,
    onBack,
}: {
    selectedChat: any;
    onSelectChat: (chat: any) => void;
    onBack: () => void;
}) => {
    const [search, setSearch] = useState<string>('');
    const [showDetails, setShowDetails] = useState<boolean>(false);

    useEffect(() => {
    if (selectedChat) {
        // Delay showing details until the list slides out
        const timer = setTimeout(() => {
            setShowDetails(true);
        }, 300); // Match the transition duration

        return () => clearTimeout(timer);
    } else {
        // Immediately hide details and show list again
        setShowDetails(false);
    }
}, [selectedChat]);


    const chats = [
        {
            id: 1,
            name: 'Pollard Chris',
            time: '12:30 pm',
            unreadCount: 1,
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
            id: 2,
            name: 'Devid Cop',
            time: '00:31:00',
            unreadCount: 0,
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
        ...Array(26).fill(null).map((_, idx) => ({
            id: idx + 3,
            name: 'Suporte ADMIN',
            time: '00:31:00',
            unreadCount: 0,
            avatar: 'https://i.pravatar.cc/150?img=3',
        })),
    ];

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative  min-h-[calc(100vh-7rem)] overflow-auto">
            {/* Chat List */}
            <div
                className={`transition-all duration-300 absolute w-full top-0 ${
                    selectedChat ? 'opacity-0 translate-x-[-100%]' : 'opacity-100 translate-x-0'
                }`}
            >
                <div className="mx-10 mt-6">
                    <div className="px-6 py-4 border border-[#E1E2FF] bg-[#FDFDFF] rounded-2xl">
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {filteredChats.map((chat,idx) => (
                            <div
                                key={idx}
                                className="flex items-center my-4 justify-between px-4 py-3 bg-white rounded-lg cursor-pointer transition hover:bg-gray-100"
                                style={chat.unreadCount ? { boxShadow: "0px 0px 8px 0px #B7B9FF" } : {}}
                                onClick={() => onSelectChat(chat)}
                            >
                                <div className="flex items-center gap-5">
                                    <img src={chat.avatar} alt={chat.name} width={40} height={40} className="rounded-full" />
                                    <div className="text-sm">
                                        <div className="font-semibold">{chat.name}</div>
                                        <div className="text-gray-400 text-xs">Pesquisar chat</div>
                                    </div>
                                </div>
                                <div className="text-sm flex flex-col items-end gap-2 relative min-w-[60px] text-end">
                                    <div className="text-black text-sm">{chat.time}</div>
                                    <div>
                                        {chat.unreadCount > 0 && (
                                            <span className="bg-[#FFF3EF] text-[#69417E] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Details */}
            {showDetails && selectedChat && (
                <div
                    className={`transition-all duration-300 absolute w-full top-0 ${
                        selectedChat ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100%]'
                    }`}
                >
                    <div className="p-4">
                        {/* <button onClick={onBack} className="text-sm text-blue-600 mb-4">← Back</button> */}
                        <ChatDetails chat={selectedChat} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatComponent;
