'use client'

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';
import { SideDrawer } from './SIdeDrawer';
import CalendarPage from './CarrerprofileDetails';
import { useState } from 'react';
interface SideDrawerProps {
    OpenCalendarView: () => void;

}
const CarerProfilePage: React.FC<SideDrawerProps> = ({ OpenCalendarView }) => {
    // const [calenderDrawer, setCalenderDrawer] = useState<boolean>(false);
    // const openCalendarDrawer = () => {
    //     setCalenderDrawer(true)
    // }
    // const closeDrawer = () => {
    //     setCalenderDrawer(prev => !prev);
    // };
    return (
        <div className="min-h-screen bg-[#F9F8FC] p-4 md:p-8 font-sans">
            {/* Header Section */}
            <div className="p-3 bg-[#FFF7F1] rounded-xl">
                <div className="flex items-center gap-6">
                    <img
                        src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face"
                        alt="Emily Harrington"
                        width={140}
                        height={140}
                        className="rounded-xl object-cover "
                    />
                    <div className="space-y-1 w-full">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-[#1E1E1E]">Emily Harrington <span className="text-gray-500">(Carer)</span></h2>
                            <div className="flex text-primary items-center gap-2">
                                <Calendar size={18} />
                                <a href='javascript:void(0);' className="rounded-xl text-primary underline">Edit Details</a>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Female | 28 Years</p>
                        <p className="text-sm text-gray-500">Member No: 1239475605</p>
                        <p className="text-sm text-gray-500">Joined: 28/07/2023</p>
                        <a href="#" className="text-sm text-indigo-600 underline">View Documents</a>
                    </div>
                </div>

            </div>

            {/* Vehicle and Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {/* Vehicle Details */}
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Vehicle Details</h3>
                    <div className="flex items-center justify-between p-5 rounded-2xl h-28 bg-[#81B29C1A] w-full">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Nexon, SUV</p>
                            <p className="text-sm text-gray-600">Model: BKQLA921000</p>
                            <p className="text-sm text-gray-600">License No: IKQLA-921000</p>
                            <a href="#" className="text-sm text-purple-600 underline mt-1 inline-block">Change Vehicle</a>
                        </div>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/744/744465.png"
                            alt="Vehicle"
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                </div>

                {/* Overview */}
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Overview</h3>
                    <div className="p-5 bg-[#edf9ff] rounded-2xl h-28 w-full">
                        <div className="flex items-baseline justify-between gap-6">
                            <div className="space-y-1 text-center">
                                <p className="text-sm text-gray-500">Total Shift</p>
                                <p className="text-2xl font-bold text-purple-700">1,054</p>
                            </div>
                            <div className="space-y-1 text-center">
                                <p className="text-sm text-gray-500">Leaves</p>
                                <p className="text-2xl font-bold text-purple-700">7</p>
                            </div>
                            <div className=" space-y-1 text-center">
                                <span className="text-sm text-gray-500">Status</span>
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                    Available
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shift Section */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Shift:</h3>
                    <div className="flex text-primary items-center gap-2">
                        <Calendar size={18} />
                        <button className="rounded-xl text-primary underline" onClick={OpenCalendarView}>View All</button>
                    </div>
                </div>

                {/* Shift List */}
                <div className="space-y-8">
                    {['Today', '26.06.2025', '26.11.2025'].map((date, index) => (
                        <div key={index}>
                            <div className='flex justify-center mb-3'>
                                <div className="border-b-2 border-[#E2E2E2] w-[40%] text-center">
                                    <p className="text-sm text-gray-500 font-semibold mb-5">{date}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {['09:00 - 10:00 am', '10:00 - 11:00 am', '10:00 - 11:00 am'].map((time, idx) => (
                                    <div key={idx} className="flex items-center px-4 py-3 bg-purple-50 p-3 rounded-4xl border border-purple-100 shadow-md w-[calc(100%/3-12px)] gap-3">
                                        <img
                                            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face"
                                            alt="Emily Harrington"
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">Emily Harrington</p>
                                            <p className="text-xs text-gray-500">{time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <SideDrawer
                isOpen={calenderDrawer}
                onClose={closeDrawer}
                avatar={''}
                title={''}
                width={'75%'}
            >
                <CalendarPage />
            </SideDrawer> */}
        </div>
    );
}
export default CarerProfilePage;