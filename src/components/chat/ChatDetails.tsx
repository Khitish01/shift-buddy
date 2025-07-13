'use client'
import { CheckCheck, Paperclip } from "lucide-react";
import { useState } from "react";

interface Message {
    id: number;
    text: string;
    time: string;
    sender: 'me' | 'other';
}
const ChatDetails = ({ chat }: { chat: any }) => {
    const [messages] = useState<Message[]>([
        { id: 1, text: "Of course, what can i help you with??", time: "9:12 AM", sender: "other" },
        { id: 2, text: "Sure, let me know when you'll be free!", time: "", sender: "other" },
        { id: 3, text: "I have some meeting now", time: "", sender: "me" },
        { id: 4, text: "Hi Alvin, good morning!!", time: "", sender: "me" },
        { id: 5, text: "Halo! Good Morning, whats up man?", time: "9:12 AM", sender: "other" },
        { id: 6, text: "Sorry to bother, can i ask you for a help today?", time: "", sender: "me" },
        { id: 7, text: "Of course, what can i help you with??", time: "9:12 AM", sender: "other" },
        { id: 8, text: "I have some meeting now", time: "", sender: "me" },
    ]);

    return (
        <>
            {/* <h2 className="text-xl font-semibold mb-4">{chat?.name}</h2> */}
            <div className="flex flex-col h-[calc(100vh-10rem)] border border-violet-200 rounded-2xl p-4 bg-white  mx-6">
                {/* Chat Header */}
                <div className="text-center text-sm text-violet-600 font-medium mb-2">Initiated Today</div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-xl px-4 py-2 max-w-[70%] text-sm ${msg.sender === 'me' ? 'bg-orange-50 text-gray-800' : 'bg-gray-100 text-gray-700'}`}>
                                {msg.text}
                                <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mt-1">
                                    {msg.time && <span>{msg.time}</span>}
                                    {msg.sender === 'me' && <CheckCheck className="text-sm" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Box */}
                <div className="mt-4 flex items-center gap-3 p-2 rounded-full border bg-gray-50">
                    <Paperclip className="text-gray-400 text-lg ml-2" />
                    <input
                        type="text"
                        placeholder="Start typing..."
                        className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
                    />
                    <button className="text-violet-500 text-xl font-bold pr-4">➤</button>
                </div>
            </div>
        </>
    );

}
export default ChatDetails;