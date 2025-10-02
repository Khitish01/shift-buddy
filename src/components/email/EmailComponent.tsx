'use client';

import { useState } from 'react';
import { SideDrawer } from '../common/SIdeDrawer';
import { Pen, Inbox, Send, Trash2, Search, Eye } from 'lucide-react';
import { EmailDetails } from './EmailDetails';
import { NewMessageCompose } from './NewMessageCompose';

export const EmailComponent = () => {
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState('Inbox');
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [showNewMessage, setShowNewMessage] = useState(false);

    const emailData = [
        {
            id: 'blood-sample',
            title: 'Blood Sample Collected for Patient',
            preview: 'This is to inform you that a blood sample has...',
            tags: ['Patient Details', '📊 Tests'],
            isImportant: true,
            isHighlighted: true
        },
        {
            id: 'jim-collection',
            title: 'Blood sample Collection for Jim',
            preview: 'Lorem ipsum dolor sit amet, consectetur...',
            tags: ['📊 Test Sample Status', '📊 Tests'],
            isImportant: false,
            isHighlighted: false
        },
        {
            id: 'sample-report',
            title: 'Sample Report',
            preview: 'Lorem ipsum dolor sit amet, consectetur...',
            tags: ['📊 Report'],
            isImportant: false,
            isHighlighted: false
        }
    ];

    const handleEmailSelect = (emailId: string) => {
        setSelectedEmails(prev =>
            prev.includes(emailId)
                ? prev.filter(id => id !== emailId)
                : [...prev, emailId]
        );
    };

    const navigationOptions = [
        { id: 'Inbox', label: 'Inbox', icon: Inbox, count: 1 },
        { id: 'Sent', label: 'Sent', icon: Send },
        { id: 'Trash', label: 'Trash', icon: Trash2 }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r">
                <div className="flex justify-center">
                    <button 
                        onClick={() => setShowNewMessage(true)}
                        className="bg-[#69417E] w-full text-white p-3 px-6 m-4 rounded-lg flex items-center justify-center gap-2"
                    >
                        <span className=""><Pen size={18} /></span>
                        <span>New Message</span>
                    </button>
                </div>

                <div className="px-4">
                    {navigationOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`flex items-center gap-3 p-2 rounded mb-2 cursor-pointer ${selectedOption === option.id
                                ? 'bg-[#69417E]/10 text-[#69417E]'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            onClick={() => setSelectedOption(option.id)}
                        >
                            <option.icon
                                size={16}
                                className={selectedOption === option.id ? 'text-[#69417E]' : ''}
                            />
                            <span>{option.label}</span>
                            {option.count && (
                                <span className="bg-[#69417E] text-white text-xs px-2 py-1 rounded-full ml-auto">
                                    {option.count}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Email List */}
            <div className={`flex-1 bg-white border-r transition-all duration-300`}>
                <div className={`p-4  border-b ${selectedEmails.length > 0 ? 'pb-0' : ''}`}>
                    <h2 className="text-xl font-semibold mb-3">{selectedOption}</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none appearance-none bg-white
          border-gray-300 focus:border-purple-500 pl-8`}
                        />
                        <span className="absolute left-2 top-3 text-gray-400"><Search size={18} /></span>
                    </div>

                    {selectedEmails.length > 0 && (
                        <div className="flex items-center gap-2 p-2 rounded">
                            <span className="text-sm font-semibold text-gray-600">{selectedEmails.length} selected</span>
                            <button className="flex items-center gap-1 p-2 text-sm hover:bg-gray-100 rounded hover:text-[#69417E]">
                                <Eye size={18} />
                                {/* View */}
                            </button>
                            <button className="flex items-center gap-1 p-2 text-sm hover:bg-gray-100 rounded hover:text-[#69417E]">
                                <Trash2 size={18} />
                                {/* Delete */}
                            </button>
                        </div>
                    )}
                </div>

                <div className="divide-y">
                    {emailData.map((email) => (
                        <div
                            key={email.id}
                            className={`p-4 cursor-pointer hover:bg-gray-50 ${email.isHighlighted ? 'bg-[#69417E]/5 border-l-4 border-[#69417E]' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedEmails.includes(email.id)}
                                    onChange={() => handleEmailSelect(email.id)}
                                    className="mt-1 accent-[#69417E]"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div
                                    className="flex-1"
                                    onClick={() => setSelectedEmail(email.id)}
                                >
                                    {email.isImportant && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-[#69417E] text-white text-xs px-2 py-1 rounded">Important</span>
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-sm mb-1">{email.title}</h3>
                                    <p className="text-xs text-gray-600 mb-2">{email.preview}</p>
                                    <div className="flex gap-1">
                                        {email.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={`text-xs px-2 py-1 rounded ${tag.includes('📊')
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-gray-200'
                                                    }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <SideDrawer
                isOpen={!!selectedEmail}
                onClose={() => setSelectedEmail(null)}
                title="Gray"
                avatar=""
                width="50%"
            >
                <EmailDetails />
            </SideDrawer>

            <SideDrawer
                isOpen={showNewMessage}
                onClose={() => setShowNewMessage(false)}
                title=""
                avatar=""
                width="50%"
            >
                <NewMessageCompose onClose={() => setShowNewMessage(false)} />
            </SideDrawer>
        </div>
    )
}