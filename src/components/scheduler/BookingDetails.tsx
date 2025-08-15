'use client'
import { useEffect, useState } from "react";
import Progressbar from "./ProgressBar";
import { apiCall } from "@/lib/apiClient";
import dayjs from "dayjs";
import { useTopLoader } from "@/context/TopLoader";
interface BookingDetailsContentProps {
    bookingId: string;
    // onSuccess: () => void;
}
export const BookingDetailsContent: React.FC<BookingDetailsContentProps> = ({ bookingId }) => {
    const [activeTab, setActiveTab] = useState("Personal & Medical Info");
    const loader = useTopLoader();
    const sampleNotes = [
        {
            id: "1",
            time: "01:30pm",
            date: "25/06/2024",
            author: "William Garcia",
            content: `On examination, findings such as vitals, physical exam results, or relevant test outcomes. Based on the current presentation, the working diagnosis is [insert diagnosis or clinical impression]. The plan includes treatment steps, medications, lifestyle advice, referrals, or follow-up instructions.`
        },
        {
            id: "2",
            time: "01:30pm",
            date: "25/06/2024",
            author: "Mia Davis",
            content: `On examination, findings such as vitals, physical exam results, or relevant test outcomes. Based on the current presentation, the working diagnosis is [insert diagnosis or clinical impression]. The plan includes treatment steps, medications, lifestyle advice, referrals, or follow-up instructions.`
        },
        {
            id: "2",
            time: "01:30pm",
            date: "25/06/2024",
            author: "Mia Davis",
            content: `On examination, findings such as vitals, physical exam results, or relevant test outcomes. Based on the current presentation, the working diagnosis is [insert diagnosis or clinical impression]. The plan includes treatment steps, medications, lifestyle advice, referrals, or follow-up instructions.`
        },
        {
            id: "2",
            time: "01:30pm",
            date: "25/06/2024",
            author: "Mia Davis",
            content: `On examination, findings such as vitals, physical exam results, or relevant test outcomes. Based on the current presentation, the working diagnosis is [insert diagnosis or clinical impression]. The plan includes treatment steps, medications, lifestyle advice, referrals, or follow-up instructions.`
        },
        {
            id: "2",
            time: "01:30pm",
            date: "25/06/2024",
            author: "Mia Davis",
            content: `On examination, findings such as vitals, physical exam results, or relevant test outcomes. Based on the current presentation, the working diagnosis is [insert diagnosis or clinical impression]. The plan includes treatment steps, medications, lifestyle advice, referrals, or follow-up instructions.`
        },
    ];

    const [bookingDetails, setBookingDetails] = useState<any>();

    const getBookingDetails = async () => {
        loader.showLoader()
        const res = await apiCall<any>('GET', `slot/v1/get_slot_details/${bookingId}`)
        console.log(res);
        setBookingDetails(res.data);
        loader.hideLoader()
    }
    useEffect(() => {
        getBookingDetails()
    }, [bookingId])
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

    return (
        <div className="p-6">

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 border-b border-gray-300">
                {['Personal & Medical Info', 'Progress Note', 'Track'].map((tab) => (
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

            {(activeTab == 'Personal & Medical Info' || activeTab == 'Progress Note') && (
                < div className="bg-gradient-to-l to-[#EFDBF4] from-[#E0E9F7] rounded-full p-4 flex items-center justify-between  mb-6">
                    <div className="flex-1">
                        <p className="font-bold text-sm">Carer Details:</p>
                    </div>
                    <div className="flex flex-1 items-center space-x-4">
                        <img
                            src={bookingDetails?.carrierId?.profileImage}
                            alt="Kriti Saren"
                            className="w-14 h-14 rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-sm text-gray-800">{bookingDetails?.carrierId?.name} | {bookingDetails?.carrierId?.gender.charAt(0).toUpperCase()}, {dayjs().diff(dayjs(bookingDetails?.carrierId?.DOB), "year")}</p>
                            <p className="text-sm text-gray-600">{bookingDetails?.carrierId?.email}</p>
                            <p className="text-sm text-gray-600">Member No. {bookingDetails?.carrierId?.carrierId}</p>
                            <p className="text-sm text-primary font-medium">{bookingDetails?.carrierId?.mobileNumber}</p>
                        </div>
                    </div>
                </div>
            )}

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
            )
            }
            {
                activeTab == 'Track' && (
                    <>
                        <div className="bg-[#FDF9FF] px-4 py-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 text-center">
                                Track Treatment - ID09876
                            </h2>
                        </div>
                        <Progressbar currentStatus={4} taskId="ID09876" />
                    </>
                )
            }
            {
                activeTab == 'Progress Note' && (
                    <>
                        <div className="bg-[#FDF9FF] px-4 py-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 text-center">
                                Track Treatment - ID09876
                            </h2>
                        </div>
                        <div className="space-y-4 max-h-[500px] overflow-auto">
                            {sampleNotes.map((note: any, index: number) => (
                                <div key={index} className="bg-[#FDF9FF] p-4">
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>{note.time}</span>
                                        <span>{note.date}</span>
                                    </div>
                                    <p className="font-semibold mb-2">{note.author}</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )
            }




        </div >
    );
};
