'use client'

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';
import { SideDrawer } from '../common/SIdeDrawer';
import CalendarPage from './CarrerprofileDetails';
import { useEffect, useState } from 'react';
import { useTopLoader } from '@/context/TopLoader';
import { apiCall } from '@/lib/apiClient';
import dayjs from 'dayjs';
import { DocumentUploadIcon } from '@/app/images';
interface CarerProfileProps {
    carrierId: string;
    OpenCalendarView: () => void;

}
const CarerProfilePage: React.FC<CarerProfileProps> = ({ carrierId, OpenCalendarView }) => {
    // const [calenderDrawer, setCalenderDrawer] = useState<boolean>(false);
    // const openCalendarDrawer = () => {
    //     setCalenderDrawer(true)
    // }
    // const closeDrawer = () => {
    //     setCalenderDrawer(prev => !prev);
    // };
    const loader = useTopLoader();
    const [bookingDetails, setBookingDetails] = useState<any>();
    const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

    const getBookingDetails = async () => {
        loader.showLoader()
        const res = await apiCall<any>('POST', `/carrier/v1/carrier_details`, { carrierId })
        console.log(res);
        setBookingDetails(res.data);
        loader.hideLoader()
    }
    const getUpcomingBooking = async () => {
        loader.showLoader()
        const res = await apiCall<any>('POST', `/slot/v1/get_upcoming_slots`, { carrierId: bookingDetails?._id, limit: 10 })
        console.log(res);
        setUpcomingBookings(res.data);
        loader.hideLoader()
    }
    useEffect(() => {
        getBookingDetails()
    }, [carrierId])
    useEffect(() => {
        getUpcomingBooking()
    }, [bookingDetails])


    const groupedData = upcomingBookings.sort((a, b) => {
        // sort by startDate first
        const dateDiff =
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        if (dateDiff !== 0) return dateDiff;
        // if same date, sort by startTime
        return a.startTime.localeCompare(b.startTime);
    })
        .reduce((acc, slot) => {
            const dateKey = dayjs(slot.startDate).format("YYYY-MM-DD");
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(slot);
            return acc;
        }, {});

    // 2️⃣ Convert object into an array of [date, slots]
    const groupedArray = Object.entries(groupedData);


    const getOriginalFileName = (url: string): string => {
        const lastSegment = url?.split('/')?.pop() || '';
        const [, ...nameParts] = lastSegment?.split('-');
        return decodeURIComponent(nameParts?.join('-'));
    };
    return (
        <div className="min-h-screen bg-[#F9F8FC] p-4 md:p-8 font-sans">
            {/* Header Section */}
            {/* {carrierId} */}
            <div className="p-3 bg-[#FFF7F1] rounded-xl">
                <div className="flex items-center gap-6">
                    <img
                        src={bookingDetails?.profileImage}
                        alt={bookingDetails?.name}
                        width={140}
                        height={140}
                        className="rounded-xl object-cover "
                    />
                    <div className="space-y-1 w-full">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-[#1E1E1E]">{bookingDetails?.name} <span className="text-gray-500">(Carer)</span></h2>
                            <div className="flex text-primary items-center gap-2">
                                <Calendar size={18} />
                                <a href='javascript:void(0);' className="rounded-xl text-primary underline">Edit Details</a>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">{bookingDetails?.gender} | {dayjs().diff(dayjs(bookingDetails?.DOB), "year")} Years</p>
                        <p className="text-sm text-gray-500">Member No: {bookingDetails?.carrierId}</p>
                        <p className="text-sm text-gray-500">Joined: {dayjs(bookingDetails?.createdAt).format('DD/MM/YYYY')}</p>
                        <div className='flex gap-3 items-center mt-3'>
                            <div className="bg-[#69417E14] border-[#F2C7AC] p-2 rounded-full mb-2">
                                <img src="/icons/phone.svg" alt="" />
                            </div>
                            <div className="bg-[#69417E14] border-[#F2C7AC] p-2 rounded-full mb-2">
                                <img src="/icons/mail.svg" alt="" />
                            </div>
                        </div>
                        {/* <a href="#" className="text-sm text-indigo-600 underline">View Documents</a> */}
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

                {/* Document Details */}
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Document Details</h3>
                    <div className="p-5 rounded-2xl h-52 bg-[#81B29C1A] w-full">
                        <div className='space-y-2.5'>
                            {/* <p className="text-sm font-medium text-gray-900">Nexon, SUV</p> */}
                            <p className="text-sm text-gray-600">Tax File Number:  {bookingDetails?.additionalDetails?.taxFileNumber ?? '-NA-'}</p>
                            <p className="text-sm text-gray-600">ABN Number: {bookingDetails?.additionalDetails?.AbnNumber ?? '-NA-'}</p>
                            <p className="text-sm text-gray-600">Workers Screening Check: {bookingDetails?.additionalDetails?.workersScreeningCheck ?? '-NA-'}</p>
                            <p className="text-sm text-gray-600">Working with Children Check: {bookingDetails?.additionalDetails?.workingWithChildernCheck ?? '-NA-'}</p>
                            <p className="text-sm text-gray-600">Police Check: {bookingDetails?.additionalDetails?.policeCheck ?? '-NA-'}</p>
                            <p className="text-sm text-gray-600">First Aid: {bookingDetails?.additionalDetails?.firstAid ?? '-NA-'}</p>
                        </div>
                    </div>
                </div>

                {/* Document Details */}
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Document Details</h3>
                    <div className="p-5 rounded-2xl h-52 overflow-auto custom-scrollbar bg-[#81B29C1A] w-full space-y-3">
                        {bookingDetails?.documents?.uploadPoliceCheck?.docId || bookingDetails?.documents?.uploadFirstAidCertificate?.docId ? (
                            <div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/eye-icon.svg" alt="" />
                                        <div className="">
                                            <p className="block text-sm font-medium text-[#78777E]">{getOriginalFileName(bookingDetails?.documents?.uploadFirstAidCertificate?.docId)}</p>
                                            <p className="block text-xs font-medium text-[#78777E]">{bookingDetails?.documents?.uploadFirstAidCertificate?.expiryDate}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <a href={bookingDetails?.documents?.uploadFirstAidCertificate?.docId} target="_blank" rel="noopener noreferrer">
                                            <img src="/icons/eye-icon.svg" alt="View" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/eye-icon.svg" alt="" />
                                        <div className="">
                                            <p className="block text-sm font-medium text-[#78777E]">{getOriginalFileName(bookingDetails?.documents?.uploadPoliceCheck?.docId)}</p>
                                            <p className="block text-xs font-medium text-[#78777E]">{bookingDetails?.documents?.uploadPoliceCheck?.expiryDate}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <a href={bookingDetails?.documents?.uploadPoliceCheck?.docId} target="_blank" rel="noopener noreferrer">
                                            <img src="/icons/eye-icon.svg" alt="View" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (

                            <div className='flex justify-center items-center text-[#78777E]'>No Documents available</div>
                        )}


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
                    {groupedArray.map(([date, slots], index) => (
                        <div key={index}>
                            {/* Date Header */}
                            <div className="flex justify-center mb-3">
                                <div className="border-b-2 border-[#E2E2E2] w-[40%] text-center">
                                    <p className="text-sm text-gray-500 font-semibold mb-5">
                                        {dayjs(date).isSame(dayjs(), "day")
                                            ? "Today"
                                            : dayjs(date).format("DD.MM.YYYY")}
                                    </p>
                                </div>
                            </div>

                            {/* Slots List */}
                            <div className="flex flex-wrap gap-4">
                                {(slots as any[]).map((slot, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center px-4 py-3 bg-purple-50 p-3 rounded-full border border-purple-100 shadow-md w-[calc(100%/3-12px)] gap-3"
                                    >
                                        <img
                                            src={
                                                slot?.clientProfileImage ||
                                                "https://via.placeholder.com/40"
                                            }
                                            alt={slot.clientName}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {slot.clientName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {slot.startTime} - {slot.endTime}
                                            </p>
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