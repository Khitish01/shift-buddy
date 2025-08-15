'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export interface Message {
  senderId: string;
  senderType: string;
  receiverId: string;
  receiverType: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
}

export interface Conversation {
  userId: string;
  userType: string;
  isUnread: boolean;
  isOnline: boolean;
  name: string;
  profileImage: string;
  latestMessage: string;
  latestMessageTime: string;
}

interface ConversationListPayload {
  unreadCount: number;
  data: Conversation[];
}

interface ChatSocketContextType {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  userId: string;
  senderType: string;
  conversations: Conversation[];
  unreadCount: number;
  messages: Message[];
  currentPage: number;
  totalPages: number;
  fetchConversations: () => void;
  fetchChatHistory: (receiverId: string, receiverType: string, page?: number) => void;
  sendMessage: (messageData: Omit<Message, "createdAt" | "isRead">) => void;
  markAsRead: (receiverId: string, receiverType: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatSocketContext = createContext<ChatSocketContextType | undefined>(undefined);

export const ChatSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(() => Cookies.get("accessToken"));

  const decoded: any = accessToken ? jwtDecode(accessToken) : {};
  const userId = decoded?.id || "";
  const senderType = decoded?.role_code === "A" ? "User" : "Carrier";

  const connectSocket = (token: string) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      auth: { token },
      extraHeaders: { "x-client-type": "web" },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("register", { userId, senderType });
      fetchConversations();
    });

    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err.message);
    });

    socket.on("conversationList", (payload: ConversationListPayload) => {
      setConversations(payload.data);
      setUnreadCount(payload.unreadCount);
    });

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      fetchConversations();
    });

    socket.on("messageSent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("messagesRead", ({ byUserId, byUserType }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.receiverId === byUserId && msg.receiverType === byUserType
            ? { ...msg, isRead: true }
            : msg
        )
      );
    });

    socket.on("chatHistory", ({ currentPage, totalPages, messages }) => {
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
      setMessages(messages);
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("Socket disconnected");
    }
  };

  // ✅ React instantly to token change (login/logout)
  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
    } else {
      disconnectSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // ✅ Listen to token changes globally
  useEffect(() => {
    let lastToken = Cookies.get("accessToken");
    const handleStorageChange = () => {
      const token = Cookies.get("accessToken");
      if (token !== lastToken) {
        console.log("🔄 Token changed:", token);
        lastToken = token;
        setAccessToken(token);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000); // fallback for cookie changes
    console.log("✅ Token listener mounted");

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
      console.log("❌ Token listener unmounted");
    };
  }, []);

  const fetchConversations = () => {
    socketRef.current?.emit("init", { userId, senderType });
  };

  const fetchChatHistory = (receiverId: string, receiverType: string, page = 1) => {
    if (!receiverId) return;
    setMessages([]);
    socketRef.current?.emit("loadChat", {
      userId,
      senderType,
      otherUserId: receiverId,
      otherUserType: receiverType,
      page,
      limit: 50,
    });
  };

  const sendMessage = (messageData: Omit<Message, "createdAt" | "isRead">) => {
    socketRef.current?.emit("sendMessage", messageData);
  };

  const markAsRead = (receiverId: string, receiverType: string) => {
    socketRef.current?.emit("markAsRead", {
      userId,
      senderType,
      otherUserId: receiverId,
      otherUserType: receiverType,
    });
  };

  return (
    <ChatSocketContext.Provider
      value={{
        socket: socketRef.current,
        userId,
        senderType,
        conversations,
        unreadCount,
        messages,
        currentPage,
        totalPages,
        fetchConversations,
        fetchChatHistory,
        sendMessage,
        markAsRead,
        setMessages
      }}
    >
      {children}
    </ChatSocketContext.Provider>
  );
};

export const useChatSocket = () => {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocket must be used within a ChatSocketProvider");
  }
  return context;
};
