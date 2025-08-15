'use client';
import { useState } from "react";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import ChatDetails from "./ChatDetails";
import { useChatSocket } from "@/context/ChatSocketContext";

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
    const { conversations } = useChatSocket();

    const filteredChats = conversations.filter(chat =>
        chat.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative min-h-[calc(100vh-7rem)] overflow-auto">
            {!selectedChat && (
                <div className="mx-10 mt-6">
                    <div className="px-6 py-4 border border-[#E1E2FF] bg-[#FDFDFF] rounded-2xl">
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {filteredChats.map((chat, idx) => (
                            <div
                                key={idx}
                                className="flex items-center my-4 justify-between px-4 py-3 bg-white rounded-lg cursor-pointer hover:bg-gray-100"
                                style={chat.isUnread ? { boxShadow: "0px 0px 8px 0px #B7B9FF" } : {}}
                                onClick={() => onSelectChat(chat)}
                            >
                                <div className="flex items-center gap-5">
                                    <img src={chat.profileImage} alt={chat.name} width={40} height={40} className="rounded-full" />
                                    <div className="text-sm">
                                        <div className="font-semibold">{chat.name}</div>
                                        <div className="text-gray-400 text-xs">{chat.latestMessage || ""}</div>
                                    </div>
                                </div>
                                <div className="text-sm flex flex-col items-end gap-2">
                                    <div>{dayjs(chat.latestMessageTime).format('DD MMM YYYY hh:mm A')}</div>
                                    {chat.isUnread && (
                                        <span className="bg-[#FFF3EF] text-[#69417E] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            1
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedChat && <ChatDetails chat={selectedChat} />}
        </div>
    );
};

export default ChatComponent;
