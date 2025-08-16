'use client'
import { usePopup } from "@/context/PopupContext";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiCall";
import { Calendar, Clock, FileText, Plus, Search, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DateInput } from "../common/date-input";
import dayjs from "dayjs";
import { DocumentUploadIcon } from "@/app/images";
import { adminClient } from "@/lib/apiClient";

interface CarerProps {
    onSuccess: () => void;
}

export const AddCarer: React.FC<CarerProps> = ({ onSuccess }) => {
    const { showPopup, updatePopupStatus } = usePopup();
    const [repeatModes, setRepeatModes] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('personal');
    const [allergyInput, setAllergyInput] = useState("");
    const [allergyTags, setAllergyTags] = useState(["POIJ", "IBM-N"]);
    const [medication, setMedication] = useState("");
    const [medicationTags, setMedicationTags] = useState(['IBM 60 - M', 'IBM 100-N']);
    const [profileImage, setProfileImage] = useState<File>();
    const documentRef = useRef<HTMLInputElement | null>(null);
    const complianceDocumentRef = useRef<HTMLInputElement | null>(null);
    const [documentsPolicyCheck, setDocumentsPolicyCheck] = useState<File | null>();
    const [documentsFirstAid, setDocumentsFirstAid] = useState<File | null>();
    const loader = useTopLoader();
    // const [formData, setFormData] = useState({
    //     clientId: '',
    //     // carrierId: '',
    //     // startDate: dayjs().format('YYYY-MM-DD'),
    //     createEmail: '',
    //     password: '',
    //     confirmPass: '',
    //     vehicle: '10:00',
    //     employmentType: '',
    //     shiftTiming: '',
    //     // dayOfWeek: dayjs().day(), //weekday number
    //     // dayOfMonth: dayjs().get('D'), //date of month
    //     // customSlotArray: [] as string[],
    //     personalInfo: {
    //         name: '',
    //         gender: '',
    //         dob: '',
    //         // clientNotes: '',
    //         profileImage: '',
    //         typeOfCare: '',
    //         email: '',
    //         mobileNumber: ''
    //     },
    //     relationInfo: {
    //         relativeName: '',
    //         relativeRelation: '',
    //         relativeNumber: ''
    //     },
    //     address: {
    //         street: '',
    //         suburb: '',
    //         state: '',
    //         postCode: ''
    //     },
    //     ndis: {
    //         ndisNumber: '89000000122',
    //         ndisType: 'NDIS Participant (NDIS)'
    //     },
    //     documents: {
    //         medicalDoc: [],
    //         complianceDoc: []
    //     },
    //     additionalDetails: {
    //         taxFileNumber: "test",
    //         AbnNumber: "test",
    //         workersScreeningCheck: "test",
    //         workingWithChildernCheck: "test",
    //         policeCheck: "test",
    //         firstAid: "test"
    //     },
    //     medicalInfo: {
    //         diagnoses: 'sdfsdfs',
    //         allergy: allergyTags,
    //         medicationAndTime: medicationTags,
    //         mobilityNotes: 'asfasfasf',
    //         emergencyPlan: 'gfghdfhdf'
    //     }
    // });
    const [formData, setFormData] = useState({
        profileImage: "",
        email: "",
        mobileNumber: "",
        DOB: "",
        name: "",
        gender: "",
        receiverEmail: "",
        createEmail: "",
        password: "",
        confirmPass: "",
        shiftTiming: "",
        employementType: "",
        vehicle: "",
        contactDetails: {

            emergencyContactNumber: "",
            FamilyMemberName: "",
            familymemberRelation: ""
        },
        address: {
            street: "",
            suburb: "",
            state: "",
            postalCode: ""
        },
        ndis: {
            ndisNumber: "",
            ndisType: ""
        },
        additionalDetails: {
            taxFileNumber: "",
            AbnNumber: "",
            workersScreeningCheck: "",
            workingWithChildernCheck: "",
            policeCheck: "",
            firstAid: ""
        },
        documents: {
            uploadPoliceCheck: {
                docId: "",
                expiryDate: ""
            },
            uploadFirstAidCertificate: {
                docId: "",
                expiryDate: ""
            }
        }

    });
    const [showAll, setShowAll] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputPolicyCheckRef = useRef<HTMLInputElement>(null);
    const fileInputFirstAidRef = useRef<HTMLInputElement>(null);
    const handleInputChange = (section: string, updatedValue: any) => {
        setFormData((prev) => ({
            ...prev,
            [section]: updatedValue
        }));
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const handleClickPolicyCheck = () => {
        fileInputPolicyCheckRef.current?.click();
    };
    const handleClickFirstAid = () => {
        fileInputFirstAidRef.current?.click();
    };
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        // debugger
        const newFiles = event.target.files?.[0] || undefined;
        if (newFiles) {

            setPreviewUrl(URL.createObjectURL(newFiles)); // creates a preview blob URL
            setProfileImage(newFiles);
        }
    }
    const handleFirstAid = (event: React.ChangeEvent<HTMLInputElement>) => {

        // debugger
        const newFiles = event.target.files?.[0] || undefined;
        if (newFiles) {

            // setPreviewUrl(URL.createObjectURL(newFiles)); // creates a preview blob URL
            setDocumentsFirstAid(newFiles);
        }
    }
    const handlePolicyCheck = (event: React.ChangeEvent<HTMLInputElement>) => {

        // debugger
        const newFiles = event.target.files?.[0] || undefined;
        if (newFiles) {

            // setPreviewUrl(URL.createObjectURL(newFiles)); // creates a preview blob URL
            setDocumentsPolicyCheck(newFiles);
        }
    }


    const uploadDocuments = async () => {
        const updatedData: any = { ...formData }; // local copy
        // showPopup('Uploading', "Documents are Uploading"); // Optional message & duration
        try {

            if (documentsPolicyCheck) {
                const formData = new FormData();
                // for (let file of documents) {

                formData.append('file', documentsPolicyCheck);
                // }
                const res = await apiCall<any>(adminClient,'POST', '/doc/v1/upload_doc', formData)
                console.log('medical documents', res);
                updatedData.documents = {
                    ...updatedData.documents,
                    uploadPoliceCheck: {
                        ...updatedData.documents.uploadPoliceCheck,
                        docId: Array.isArray(res.documentId) ? res.documentId[0] : res.documentId
                    }
                }
                // setFormData(prev => ({
                //     ...prev,
                //     documents: 
                // }));

            }

            if (documentsFirstAid) {
                const formData = new FormData();
                // for (let file of complianceDocuments) {

                formData.append('file', documentsFirstAid);
                // }
                const res = await apiCall<any>(adminClient,'POST', '/doc/v1/upload_doc', formData)
                console.log('compliance documents', res);
                updatedData.documents = {
                    ...updatedData.documents,
                    uploadFirstAidCertificate: {
                        ...updatedData.documents.uploadFirstAidCertificate,
                        docId: Array.isArray(res.documentId) ? res.documentId[0] : res.documentId
                    }
                }

            }

            if (profileImage) {
                const formDataProfile = new FormData();
                formDataProfile.append("file", profileImage);

                const res = await apiCall<any>(adminClient,"POST", "/doc/v1/upload_doc", formDataProfile);
                updatedData.profileImage = Array.isArray(res.documentId) ? res.documentId[0] : res.documentId
            }

            return updatedData;
            // console.log(res)
        } catch (error) {
            console.error('Error setting role:', error)
            updatePopupStatus("error", "Upload Failed!", "Your documents upload has failed!", 4000);
            throw error;
        }
    }

    const handleAddParticipant = async () => {
        // After booking logic

        showPopup("Carer Onboarding", "Carer onboarding process");
        // loader.showLoader()

        try {
            updatePopupStatus("loading", "Uploading", "Documents are Uploading");

            const updatedFormData = await uploadDocuments();
            delete updatedFormData.confirmPass
            delete updatedFormData.vehicle
            const res = await apiCall<any>(adminClient,'POST', '/carrier/v1/create_carrier', updatedFormData)
            console.log(res)
            updatePopupStatus('success', 'Booking Confirmed!', "Your booking has been confirmed!", 4000); // Optional message & duration
            onSuccess();
        } catch (error) {
            console.error('Error setting role:', error)
        }



        // setTimeout(() => {
        //     updatePopupStatus('success', 'Booking Confirmed!', "Your booking has been confirmed!", 4000); // Optional message & duration
        // }, 1000)
    };

    return (
        <div className="p-6">

            {/* Tabs */}
            <div className="flex justify-between items-center mb-6 border-b border-b-[#D4D4D4]">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`py-2 px-4 text-[#79808F] text-sm font-medium transition-colors ${activeTab === 'personal'
                            ? 'border-b-[3px] border-primary text-primary'
                            : ''
                            }`}
                    >
                        Personal Details
                    </button>
                    <button
                        onClick={() => setActiveTab('document')}
                        className={`py-2 px-4 text-sm text-[#79808F] font-medium transition-colors ${activeTab === 'document'
                            ? 'border-b-[3px] border-primary text-primary'
                            : ''
                            }`}
                    >
                        Document Management
                    </button>
                    <button
                        onClick={() => setActiveTab('credential')}
                        className={`py-2 px-4 text-sm text-[#79808F] font-medium transition-colors ${activeTab === 'credential'
                            ? 'border-b-[3px] border-primary text-primary'
                            : ''
                            }`}
                    >
                        Email & Password Management
                    </button>
                </div>
            </div>



            <div className="min-h-[calc(100vh-15rem)]">
                {activeTab === 'personal' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-5">
                                <h3 className="text-lg font-medium text-gray-900 ">Personal data</h3>

                                {/* Upload */}
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Pic</label>
                                    <input type="file" onChange={handleProfileChange} hidden ref={fileInputRef} />
                                    <label onClick={handleClick} className="block">
                                        {!profileImage ? (
                                            <div className="border-2 flex flex-col justify-center items-center border-dashed border-gray-300 rounded-lg p-6  cursor-pointer">
                                                <div className="bg-[#F5F5F5] p-3 rounded-full mb-2 ">
                                                    <DocumentUploadIcon />
                                                </div>
                                                <p className="text-sm text-gray-600">Click to Upload</p>
                                                <p className="text-xs text-gray-500">(Max. File size: 25 MB)</p>
                                            </div>
                                        ) : (
                                            <img src={previewUrl} alt="Preview" className="h-36 w-36 object-contain" />
                                        )}
                                    </label>
                                </div>

                                {/* DOB */}
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">DOB</label>
                                    <DateInput
                                        value={formData.DOB}
                                        onChange={(value) => setFormData({ ...formData, DOB: value as string })}
                                        dateFormat={'yyyy-mm-dd'}
                                        calendarMode={'dropdown'}
                                        selectionMode={'single'}
                                        readonly={true}
                                        placeholder="Click to select date via calendar"
                                    />
                                </div>

                                {/* Name */}
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Gender */}
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) =>
                                            setFormData({ ...formData, gender: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Shift Timing */}
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Timing</label>
                                    <select
                                        value={formData.shiftTiming}
                                        onChange={(e) =>
                                            setFormData({ ...formData, shiftTiming: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Morning Shift">Morning Shift</option>
                                    </select>
                                </div>

                                {/* Employment Type */}
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                                    <select
                                        value={formData.employementType}
                                        onChange={(e) =>
                                            setFormData({ ...formData, employementType: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Full Time">Full Time</option>
                                    </select>
                                </div>

                                {/* NDIS */}
                                <h3 className="text-lg font-medium text-gray-900 mt-6 ">NDIS</h3>
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">NDIS No.</label>
                                    <input
                                        type="text"
                                        value={formData.ndis.ndisNumber}
                                        onChange={(e) =>
                                            handleInputChange('ndis', { ...formData.ndis, ndisNumber: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">NDIS types</label>
                                    <select
                                        value={formData.ndis.ndisType}
                                        onChange={(e) =>
                                            handleInputChange('ndis', { ...formData.ndis, ndisType: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="NDIS Participant (NDIS)">NDIS Participant (NDIS)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone No.</label>
                                    <input
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={(e) =>
                                            setFormData({ ...formData, mobileNumber: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Emergency Contact */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number</label>
                                    <input
                                        type="tel"
                                        value={formData.contactDetails.emergencyContactNumber}
                                        onChange={(e) =>
                                            handleInputChange('contactDetails', { ...formData.contactDetails, emergencyContactNumber: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Family Member Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Member Name</label>
                                    <input
                                        type="text"
                                        value={formData.contactDetails.FamilyMemberName}
                                        onChange={(e) =>
                                            handleInputChange('relationInfo', { ...formData.contactDetails, FamilyMemberName: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Family Member Relation */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Member Relation</label>
                                    <input
                                        type="text"
                                        value={formData.contactDetails.familymemberRelation}
                                        onChange={(e) =>
                                            handleInputChange('relationInfo', { ...formData.contactDetails, familymemberRelation: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Address */}
                                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Adress</h3>
                                {(Object.keys(formData.address) as (keyof typeof formData.address)[]).map((field) => (
                                    <div className="mb-4" key={field}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address[field]}
                                            onChange={(e) =>
                                                handleInputChange('address', {
                                                    ...formData.address,
                                                    [field]: e.target.value
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}

                    </div>
                )}


                {activeTab === 'document' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="space-y-5">

                            {/* Tax File Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tax File Number</label>
                                <input
                                    type="text"
                                    value={formData.additionalDetails.taxFileNumber || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, taxFileNumber: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* ABN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">ABN</label>
                                <input
                                    type="text"
                                    value={formData.additionalDetails.AbnNumber || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, AbnNumber: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Screening Checks */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Screening Checks</label>
                                <input
                                    type="text"
                                    value={formData.additionalDetails.workersScreeningCheck || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, workersScreeningCheck: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Working with Children Check */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Working with Children Check</label>
                                <select
                                    value={formData.additionalDetails.workingWithChildernCheck || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, workingWithChildernCheck: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {/* Police Check */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Police Check</label>
                                <select
                                    value={formData.additionalDetails.policeCheck || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, policeCheck: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {/* First Aid */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Aid</label>
                                <select
                                    value={formData.additionalDetails.firstAid || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, firstAid: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {/* Assign Vehicle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Vehicle</label>
                                <select
                                    value={formData.vehicle || ""}
                                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="">Select</option>
                                    <option value="OD01AK0344">OD01AK0344</option>
                                    <option value="OD33Y6025">OD33Y6025</option>
                                </select>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - UPLOADS */}
                        <div className="space-y-8">

                            {/* Police Check Upload */}
                            <div className="space-y-5">
                                <p className="text-base font-medium mb-2">Upload Police Checks</p>
                                {/* Custom file upload */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition">
                                    <div className="flex flex-col items-center" onClick={handleClickPolicyCheck}>
                                        <div className="bg-[#F5F5F5] p-3 rounded-full mb-2">
                                            <DocumentUploadIcon />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Click to Upload</p>
                                        <p className="text-xs text-gray-500">(Max. File size: 25 MB)</p>
                                    </div>
                                    {/* <input type="file"  /> */}
                                    <input type="file" onChange={handlePolicyCheck} hidden ref={fileInputPolicyCheckRef} />
                                </div>

                                {/* Uploaded file tag */}
                                {documentsPolicyCheck && <div className="flex items-center gap-2 mt-3 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {documentsPolicyCheck?.name}
                                    <button className="ml-2 text-purple-500 hover:text-purple-700" onClick={() => setDocumentsPolicyCheck(null)}>×</button>
                                </div>}

                                {/* Custom Date Picker */}
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Set Expiry Dates</p>
                                    <DateInput
                                        value={formData.documents.uploadPoliceCheck.expiryDate}
                                        onChange={(value) => {
                                            handleInputChange('documents.uploadPoliceCheck', { ...formData.documents.uploadPoliceCheck, expiryDate: value })
                                            // setFormData({ ...formData, startDate: value as string, dayOfMonth: dayjs(value as string, 'YYYY-MM-DD').get('D'), dayOfWeek: dayjs(value as string, 'YYYY-MM-DD').day() })
                                        }}
                                        dateFormat={'yyyy-mm-dd'}
                                        calendarMode={'dropdown'}
                                        selectionMode={'single'}
                                        readonly={true}
                                        placeholder={"Click to select date via calendar"}
                                    />
                                </div>
                            </div>

                            {/* First Aid Certificate Upload */}
                            <div>
                                <p className="text-base font-medium mb-2">Upload First Aid Certificates</p>

                                {/* Custom file upload */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition">
                                    <div className="flex flex-col items-center" onClick={handleClickFirstAid}>
                                        <div className="bg-[#F5F5F5] p-3 rounded-full mb-2">
                                            <DocumentUploadIcon />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Click to Upload</p>
                                        <p className="text-xs text-gray-500">(Max. File size: 25 MB)</p>
                                    </div>
                                    <input type="file" onChange={handleFirstAid} hidden ref={fileInputFirstAidRef} />
                                </div>

                                {/* Uploaded file tag */}
                                {documentsFirstAid && <div className="flex items-center gap-2 mt-3 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {documentsFirstAid?.name}
                                    <button className="ml-2 text-purple-500 hover:text-purple-700" onClick={() => setDocumentsFirstAid(null)}>×</button>
                                </div>}

                                {/* Custom Date Picker */}
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Set Expiry Dates</p>
                                    <DateInput
                                        value={formData.documents.uploadFirstAidCertificate.expiryDate}
                                        onChange={(value) => {
                                            handleInputChange('documents.uploadFirstAidCertificate', { ...formData.documents.uploadFirstAidCertificate, expiryDate: value })
                                        }}
                                        dateFormat={'yyyy-mm-dd'}
                                        calendarMode={'dropdown'}
                                        selectionMode={'single'}
                                        readonly={true}
                                        placeholder={"Click to select date via calendar"}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                )}


                {activeTab === 'credential' && (

                    <div className="space-y-5">

                        {/* Tax File Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Email</label>
                            <input
                                type="text"
                                value={formData.receiverEmail || ""}
                                onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}

                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Create Email</label>
                            <input
                                type="text"
                                value={formData.createEmail || ""}
                                onChange={(e) => setFormData({ ...formData, createEmail: e.target.value })}

                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* ABN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={formData.password || ""}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Screening Checks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={formData.confirmPass || ""}
                                onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5">
                <div className="flex justify-end">
                    {activeTab == 'personal' && (
                        <button
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                            onClick={() => setActiveTab('document')}
                        >
                            Continue
                        </button>

                    )}
                    {activeTab == 'document' && (
                        <button
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                            onClick={() => setActiveTab('credential')}
                        >
                            Continue
                        </button>

                    )}
                    {activeTab == 'credential' && (
                        <button onClick={handleAddParticipant} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-purple-800">
                            Add Participant
                        </button>

                    )}

                </div>
                <div className="text-right">
                </div>
            </div>
        </div >
    );
};