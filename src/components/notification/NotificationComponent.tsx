'use client'
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Rocket, X } from "lucide-react";

const NotificationComponent = () => {


    const notifications = [
        {
            id: 1,
            title: 'Notification title',
            time: '10 mins ago',
            message:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
            bgColor: 'bg-[#FFF0F080]',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        {
            id: 2,
            title: 'Notification title',
            time: '10 mins ago',
            message:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
            bgColor: 'bg-[#EDF9FF80]',
            icon: <Rocket size={24} className="text-purple-500" />,
        },
        {
            id: 3,
            title: 'Notification title',
            time: '10 mins ago',
            message:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
            bgColor: 'bg-[#F7F3FF80]',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        {
            id: 4,
            title: 'Notification title',
            time: '10 mins ago',
            message:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
            bgColor: 'bg-[#FFF7ED80]',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        {
            id: 5,
            title: 'Notification title',
            time: '10 mins ago',
            message:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
            bgColor: 'bg-[#EFFEF580]',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
    ];

    return (
        <div className="relative overflow-hidden m-6 mt-0 min-h-[calc(100vh-7rem)]">
            {/* Chat List */}



            {/* <Input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        /> */}
            {notifications.map((n, idx) => (
                <div
                    key={idx}
                    className={`flex items-start my-6 justify-between rounded-sm p-4  ${n.bgColor}`}
                >
                    <div className="flex gap-4 items-center">
                        {/* Avatar or Icon */}
                        {n.avatar ? (
                            <img
                                src={n.avatar}
                                alt="avatar"

                                className="rounded-full h-14 w-14"
                            />
                        ) : (
                            <div className="mt-1">{n.icon}</div>
                        )}

                        {/* Text content */}
                        <div>
                            <div className="font-semibold text-sm text-gray-800 flex gap-2 items-center">
                                {n.title}
                                <span className="text-xs text-gray-400">{n.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{n.message}</p>
                        </div>
                    </div>

                    {/* Close button */}
                    <button className="text-zinc-800 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>
            ))}
        </div>


    );
};

export default NotificationComponent;
