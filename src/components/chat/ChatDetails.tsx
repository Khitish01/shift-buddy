'use client';
import { CheckCheck, Paperclip } from "lucide-react";
import dayjs from "dayjs";
import { useRef, useEffect, useState } from "react";
import { useChatSocket } from "@/context/ChatSocketContext";

interface ChatDetailsProps {
  chat: {
    userId: string;
    userType: string;
    name?: string;
    profileImage?: string;
  };
}

const ChatDetails = ({ chat }: ChatDetailsProps) => {
  const {
    userId,
    senderType,
    messages,
    fetchChatHistory,
    markAsRead,
    sendMessage,
  } = useChatSocket();

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Load chat history when chat changes
  useEffect(() => {
    if (chat?.userId && chat?.userType) {
      fetchChatHistory(chat.userId, chat.userType, 1);
      markAsRead(chat.userId, chat.userType);
    }
  }, [chat]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    sendMessage({
      senderId: userId,
      senderType,
      receiverId: chat.userId,
      receiverType: chat.userType,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] border border-violet-200 rounded-2xl p-4 bg-white mx-6">
      {/* Chat Header */}
      <div className="text-center text-sm text-primary font-medium mb-1">
        {messages.length > 0
          ? dayjs(messages[0].createdAt).isSame(dayjs(), "day")
            ? "Initiated Today"
            : `Initiated on ${dayjs(messages[0].createdAt).format("DD MMM YYYY")}`
          : "Initiated"}
      </div>
      {messages.length > 0 && (
        <div className="text-center text-xs text-gray-400 mb-4">
          {dayjs(messages[0].createdAt).format("h:mm A")}
        </div>
      )}

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === userId;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-xl px-4 py-2 max-w-[70%] text-sm ${
                  isMe
                    ? "bg-orange-50 text-gray-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {msg.message}
                <div className="flex items-center justify-end gap-2 text-xs text-gray-400 mt-1">
                  {msg.createdAt && <span>{dayjs(msg.createdAt).format("h:mm A")}</span>}
                  {isMe && (
                    <CheckCheck
                      size={16}
                      style={{ color: msg.isRead ? "#0d6efd" : "#9ca3af" }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input Box */}
      <div className="mt-4 flex items-center gap-3 p-2 rounded-full border bg-gray-50">
        <Paperclip className="text-gray-400 text-lg ml-2" />
        <input
          type="text"
          placeholder="Start typing..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
        />
        <button
          onClick={handleSend}
          className="text-primary text-xl font-bold pr-4"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatDetails;
