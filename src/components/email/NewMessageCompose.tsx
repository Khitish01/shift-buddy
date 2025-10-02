'use client';

import { useState } from 'react';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';

interface NewMessageComposeProps {
    onClose: () => void;
}

export const NewMessageCompose = ({ onClose }: NewMessageComposeProps) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showCcBcc, setShowCcBcc] = useState(false);

    const handleSend = () => {
        // Handle send logic here
        console.log('Sending message:', { to, subject, message });
        onClose();
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b">
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold">New Message</h2>
            </div>

            {/* Form */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 space-y-3">
                    {/* To Field */}
                    <div className="flex items-center">
                        <label className="text-sm text-gray-600 w-12">To</label>
                        <input
                            type="email"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="flex-1 px-3 py-2 border-0 border-b border-gray-200 focus:outline-none focus:border-[#69417E] bg-transparent"
                            placeholder=""
                        />
                        <button 
                            onClick={() => setShowCcBcc(!showCcBcc)}
                            className="text-sm text-gray-500 hover:text-[#69417E] ml-2"
                        >
                            Cc Bcc
                        </button>
                    </div>

                    {/* Cc/Bcc Fields */}
                    {showCcBcc && (
                        <>
                            <div className="flex items-center">
                                <label className="text-sm text-gray-600 w-12">Cc</label>
                                <input
                                    type="email"
                                    className="flex-1 px-3 py-2 border-0 border-b border-gray-200 focus:outline-none focus:border-[#69417E] bg-transparent"
                                    placeholder=""
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-sm text-gray-600 w-12">Bcc</label>
                                <input
                                    type="email"
                                    className="flex-1 px-3 py-2 border-0 border-b border-gray-200 focus:outline-none focus:border-[#69417E] bg-transparent"
                                    placeholder=""
                                />
                            </div>
                        </>
                    )}

                    {/* Subject Field */}
                    <div className="flex items-center">
                        <label className="text-sm text-gray-600 w-12">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 px-3 py-2 border-0 border-b border-gray-200 focus:outline-none focus:border-[#69417E] bg-transparent"
                            placeholder=""
                        />
                    </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 p-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-full resize-none border-0 focus:outline-none bg-transparent"
                        placeholder=""
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t">
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <Paperclip size={20} className="text-gray-600" />
                    </button>
                    <button 
                        onClick={handleSend}
                        className="bg-[#69417E] text-white px-6 py-2 rounded-lg hover:bg-[#69417E]/90 flex items-center gap-2"
                    >
                        <Send size={16} />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};