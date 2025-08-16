'use client'
import { useEffect, useState } from "react";
import { apiCall } from "@/lib/apiCall";
import dayjs from "dayjs";
import { useTopLoader } from "@/context/TopLoader";
import Progressbar from "../scheduler/ProgressBar";
import { adminClient } from "@/lib/apiClient";
interface BookingDetailsContentProps {
    clientId: string;
    // onSuccess: () => void;
}
export const ParticipantProfile: React.FC<BookingDetailsContentProps> = ({ clientId }) => {
    const [activeTab, setActiveTab] = useState("Personal & Medical Info");
    const loader = useTopLoader();
    const sampleNotes = [
        {
            time: "01:30pm",
            date: "25/06/2024",
            bookingId: "4355869",
            status: "Completed",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            author: "Leo Carter",
            userId: "888353",
            startTime: "08:00 am",
            endTime: "08:30 am"
        },
        {
            time: "10:15am",
            date: "18/07/2024",
            bookingId: "4355870",
            status: "Pending",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            author: "Sophie Miller",
            userId: "888354",
            startTime: "09:00 am",
            endTime: "09:30 am"
        }
    ];

    const [bookingDetails, setBookingDetails] = useState<any>();
    const [bookingHistorty, setBookingHistorty] = useState<any[]>([]);

    const getPatientDetails = async () => {
        loader.showLoader()
        const res = await apiCall<any>(adminClient,'GET', `/client/v1/get_client/${clientId}`)
        console.log(res);
        setBookingDetails(res.data);
        loader.hideLoader()
    }
    const getBookingHistory = async () => {
        loader.showLoader()
        let payload = {
            "clientId": bookingDetails?._id,
            "page": "1",
            "limit": "15"
        }
        const res = await apiCall<any>(adminClient,'POST', `/client/v1/get_client_history`,payload)
        console.log(res);
        setBookingHistorty(res.data);
        loader.hideLoader()
    }
    useEffect(() => {
        getPatientDetails()
    }, [clientId])
    const getOriginalFileName = (url: string): string => {
        try {
            const lastSegment = url.split('/').pop(); // Get '1751132493819-Resume-Khitish-Mangal%20%281%29.pdf'
            const [, ...nameParts] = lastSegment?.split('-') ?? []; // Remove the timestamp
            const fileName = nameParts.join('-'); // Rejoin remaining parts
            return decodeURIComponent(fileName); // Decode URL-encoded characters
        } catch (err) {
            return 'Document';
        }
    };

    const calculateAge = (dobString: string) => {
        return dayjs().diff(dayjs(dobString), "year");
    };

    useEffect(() => {
        if (activeTab == 'Booking History') {
            getBookingHistory()
        }
    }, [activeTab])

    return (
        <div className="p-6">

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 border-b border-gray-300">
                {['Personal & Medical Info', 'Booking History'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 pb-2 font-medium text-sm border-b-[3px] transition-colors ${activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-primary'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab == 'Personal & Medical Info' && (
                <>
                    <div className="grid grid-cols-2 gap-8 rounded-xl bg-[#DCB8F014] p-6">
                        <div className="space-y-7">
                            {/* <p className="font-bold text-sm">Medical info</p> */}
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Scheduled Visit Time</p>
                                <p className="block text-sm font-medium text-black">{dayjs(bookingDetails?.startDate).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Duration</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.startTime + ' - ' + bookingDetails?.endTime}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Type of Service</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.personalInfo.typeOfCare != '' ? bookingDetails?.personalInfo.typeOfCare : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Important Participant Notes</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.personalInfo.clientNotes != '' ? bookingDetails?.personalInfo.clientNotes : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Shift Information</p>
                                <p className="block text-sm font-medium text-black">Bring a valid ID and your insurance card</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Scheduled Visit Time</p>
                                <p className="block text-sm font-medium text-black">{dayjs(bookingDetails?.startDate).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Duration</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.startTime + ' - ' + bookingDetails?.endTime}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Type of Service</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.personalInfo.typeOfCare != '' ? bookingDetails?.personalInfo.typeOfCare : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Important Participant Notes</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.personalInfo.clientNotes != '' ? bookingDetails?.personalInfo.clientNotes : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Shift Information</p>
                                <p className="block text-sm font-medium text-black">Bring a valid ID and your insurance card</p>
                            </div>



                        </div>

                        <div className="space-y-7">
                            {/* <p className="font-bold text-sm">Medical info</p> */}
                            {(bookingDetails?.documents?.medicalDoc?.length > 0 || bookingDetails?.documents?.complianceDoc?.length > 0) && (
                                <div className="mb-7">
                                    {[...(bookingDetails?.documents?.medicalDoc || []), ...(bookingDetails?.documents?.complianceDoc || [])].map((docUrl, index) => {
                                        const getOriginalFileName = (url: string): string => {
                                            const lastSegment = url.split('/').pop() || '';
                                            const [, ...nameParts] = lastSegment.split('-');
                                            return decodeURIComponent(nameParts.join('-'));
                                        };

                                        return (
                                            <div key={index} className="flex justify-between items-center mb-2">
                                                <div className="space-y-1">
                                                    <p className="block text-sm font-medium text-[#78777E]">{getOriginalFileName(docUrl)}</p>
                                                </div>
                                                <div>
                                                    <a href={docUrl} target="_blank" rel="noopener noreferrer">
                                                        <img src="/icons/eye-icon.svg" alt="View" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {/* <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="block text-sm font-medium text-[#78777E]">Prescription.jpg</p>
                                    
                                </div>
                                <div>
                                    <img src="/icons/eye-icon.svg" alt="" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="block text-sm font-medium text-[#78777E]">Prescription.pdf</p>
                                    
                                </div>
                                <div>
                                    <img src="/icons/eye-icon.svg" alt="" />
                                </div>
                            </div> */}
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Family Member / Medical Emergency Contact</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.relationInfo?.relativeName != '' ? bookingDetails?.relationInfo?.relativeName : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Emergency Contact Phone Number</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.relationInfo?.relativeNumber != '' ? bookingDetails?.relationInfo?.relativeNumber : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Emergency Contact Relationship</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.relationInfo?.relativeRelation != '' ? bookingDetails?.relationInfo?.relativeRelation : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Diagnoses or Disability</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.medicalInfo?.diagnoses != '' ? bookingDetails?.medicalInfo?.diagnoses : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Allergies</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.medicalInfo?.allergy.length > 0 ? bookingDetails?.medicalInfo?.allergy.join(',') : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Medications with Dosage & Timing</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.medicalInfo?.medicationAndTime.length > 0 ? bookingDetails?.medicalInfo?.medicationAndTime.join(',') : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Mobility Notes</p>
                                <p className="block text-sm font-medium text-black">{bookingDetails?.medicalInfo?.mobilityNotes != '' ? bookingDetails?.medicalInfo?.mobilityNotes : '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="block text-sm font-medium text-[#78777E]">Restrictive Practices</p>
                                <p className="block text-sm font-medium text-black">-</p>
                            </div>


                        </div>
                    </div>
                </>
            )}
            {
                activeTab == 'Booking History' && (
                    <>
                        <div className="space-y-4 overflow-auto">
                            {bookingHistorty.map((slot: any, index: number) => (
                                <div key={index} className="bg-[#FEFAF9] p-4 rounded-lg">
                                    <div className="flex justify-between">
                                        <div className="space-y-3">
                                            <div className=" text-xs text-gray-500 mb-2">
                                                <span>{slot.startTime}</span>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                Booking ID - #{slot.bookingId}
                                            </p>
                                            <div className="flex items-center gap-3 bg-[#F6F4FF] rounded-full px-3 py-2 w-fit">
                                                <img
                                                    src={slot.carrierId.profileImage}
                                                    alt={slot.carrierId.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {slot.carrierId.name} - #{slot.carrierId.carrierId}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {slot.startTime} - {slot.endTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className=" text-xs text-gray-500">
                                                <span>{dayjs(slot.startDate).format('DD MMM YYYY')}</span>

                                            </div>
                                            <p className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                                                {slot.slotStatus.statusName}
                                            </p>
                                            <a href="#" className="text-xs text-purple-600 underline">
                                                Progress Report
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </>
                )
            }




        </div >
    );
};
