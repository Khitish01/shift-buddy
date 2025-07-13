import React, { useEffect, useState } from 'react';
import { X, Upload, Calendar, Clock, User, Phone, Mail, MapPin, FileText, Plus, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    avatar: string
    children: React.ReactNode;
    width?: string;
    onBack?: () => void; // optional back button handler
    isBackButton?: boolean
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, avatar, title, children, width = '50%', onBack, isBackButton = false }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden')
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            document.body.classList.remove('overflow-hidden')
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 h-screen w-screen bg-[#0000000b] bg-opacity-50 z-[99] transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-screen ${isMobile ? 'w-[95%]' : width == '75%' ? 'w-[80%]' : 'w-[50%]'
                    } bg-white overflow-auto shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-0 h-16">

                    {avatar == '' ? (
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    ) : (
                        <div className='flex items-center gap-3'>
                            {isBackButton && (
                                <button
                                    onClick={onBack}
                                    className="mr-3 p-2 cursor-pointer rounded-full text-zinc-800 bg-[#F3F3F3]"
                                    title="Back"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <img src={avatar} alt="" className='rounded-full h-8 w-8' />
                            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 bg-[#F4F1F1] rounded-full transition-colors"
                    >
                        <X size={12} className="text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    );
};