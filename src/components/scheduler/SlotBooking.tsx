'use client'
import { usePopup } from "@/context/PopupContext";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiCall";
import { Calendar, Clock, FileText, Plus, Search, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DateInput } from "../common/date-input";
import dayjs from "dayjs";
import { ValidatedInput } from "../ui/ValidatedInput";
import { fieldSchemas } from "@/lib/validationSchemas";
import { ValidatedSelect } from "../ui/ValidatedSelect";
import z from "zod";
import PlacesAutocomplete from "../common/PlacesAutocomplete";
import { adminClient } from "@/lib/apiClient";

interface BookSlotContentProps {
    // isOpen: boolean;
    onSuccess: () => void;
    slotId?: string;
    // avatar: string
    // children: React.ReactNode;
    // width?: string;
    // onBack?: () => void; // optional back button handler
    // isBackButton?: boolean
}

export const BookSlotContent: React.FC<BookSlotContentProps> = ({ slotId, onSuccess }) => {
    const { showPopup, updatePopupStatus } = usePopup();
    const [repeatModes, setRepeatModes] = useState<any[]>([])
    const [ndisTypes, setNdisTypes] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('personal');
    const [allergyInput, setAllergyInput] = useState("");
    const [clientId, setClientId] = useState('');
    const [allergyTags, setAllergyTags] = useState<string[]>([]);
    const [medication, setMedication] = useState("");
    const [medicationTags, setMedicationTags] = useState<string[]>([]);
    const [profileImage, setProfileImage] = useState<File>();
    const documentRef = useRef<HTMLInputElement | null>(null);
    const complianceDocumentRef = useRef<HTMLInputElement | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [complianceDocuments, setComplianceDocuments] = useState<File[]>([]);
    const loader = useTopLoader();
    // const [multipleValue, setMultipleValue] = useState<string[]>([])
    // const [slotDetails, setSlotDetails] = useState<any>()
    const [carerList, setCarerList] = useState<any[]>([])
    const durationInMinutes = 30;
    const [formData, setFormData] = useState({
        clientId: '',
        carrierId: '',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        startTime: dayjs().format("HH:mm"),
        endTime: dayjs().add(durationInMinutes, "minute").format("HH:mm"),
        duration: `${durationInMinutes}mins`,
        repeatId: '',
        dayOfWeek: dayjs().day(), //weekday number
        dayOfMonth: dayjs().get('D'), //date of month
        customSlotArray: [] as string[],
        personalInfo: {
            name: '',
            gender: '',
            dob: '',
            clientNotes: '',
            profileImage: '',
            typeOfCare: '',
            email: '',
            mobileNumber: ''
        },
        relationInfo: {
            relativeName: '',
            relativeRelation: '',
            relativeNumber: ''
        },
        address: {
            street: '',
            suburb: '',
            state: '',
            postCode: '',
            locationUrl: ''
        },
        ndis: {
            ndisNumber: '',
            ndisType: ''
        },
        documents: {
            medicalDoc: [],
            complianceDoc: []
        },
        medicalInfo: {
            diagnoses: '',
            allergy: allergyTags,
            medicationAndTime: medicationTags,
            mobilityNotes: '',
            emergencyPlan: ''
        }
    });
    const [showAll, setShowAll] = useState(false);

    const handleRemoveDate = (dateToRemove: string) => {
        const updatedDates = formData.customSlotArray.filter((date) => date !== dateToRemove)
        // setMultipleValue((prev) => prev.filter((date) => date !== dateToRemove));
        // formData.customSlotArray
        setFormData({ ...formData, customSlotArray: updatedDates })
    };

    const toggleShowAll = () => {
        setShowAll((prev) => !prev);
    };

    const getRepeatMode = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'GET', '/master/v1/get_repeat_mode')
            console.log(res);
            setRepeatModes(res?.data)
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }
    }
    const getNdisType = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'GET', '/master/v1/get_ndis')
            console.log(res);
            setNdisTypes(res?.data)
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }
    }
    useEffect(() => {
        getRepeatMode()
        getNdisType()
    }, [])
    useEffect(() => {
        console.log(repeatModes.filter((x: any) => x.repeatType == 'Does not repeat')?.[0]?._id);

        setFormData(prev => ({
            ...prev,
            repeatId: repeatModes.filter((x: any) => x.repeatType == 'Does not repeat')?.[0]?._id
        }))
    }, [repeatModes])

    const addAllergyTag = () => {
        const trimmed = allergyInput.trim();
        if (trimmed && !allergyTags.includes(trimmed)) {
            setAllergyTags([...allergyTags, trimmed]);
            setFormData(prev => ({
                ...prev,
                medicalInfo: {
                    ...prev.medicalInfo,
                    allergy: [...allergyTags, trimmed]
                }
            }));
            setAllergyInput("");
        }
    };

    const removeAllergyTag = (index: number) => {
        const updated = [...allergyTags];
        updated.splice(index, 1);
        setAllergyTags(updated);
        setFormData(prev => ({
            ...prev,
            medicalInfo: {
                ...prev.medicalInfo,
                allergy: updated
            }
        }));
    };





    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        const uniqueFiles = newFiles.filter(
            (newFile) => !documents.some((doc) => doc.name === newFile.name)
        );
        setDocuments([...documents, ...uniqueFiles]);
        // setFormData(prev => ({
        //     ...prev,
        //     documents: {
        //         ...prev.documents,
        //         medicalDoc: [...documents, ...uniqueFiles]
        //     }
        // }));
    };
    const handleComplianceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        const uniqueFiles = newFiles.filter(
            (newFile) => !complianceDocuments.some((doc) => doc.name === newFile.name)
        );
        setComplianceDocuments([...complianceDocuments, ...uniqueFiles]);
        // setFormData(prev => ({
        //     ...prev,
        //     documents: {
        //         ...prev.documents,
        //         complianceDoc: [...complianceDocuments, ...uniqueFiles]
        //     }
        // }));
    };

    const handleAddClick = () => {
        documentRef.current?.click();
    };
    const handleAddComplianceClick = () => {
        complianceDocumentRef.current?.click();
    };

    const handleRemove = (fileName: string) => {
        const updatedDocuments = documents.filter((doc) => doc.name !== fileName);
        setDocuments(updatedDocuments);

        // setFormData(prev => ({
        //     ...prev,
        //     documents: {
        //         ...prev.documents,
        //         medicalDoc: updatedDocuments
        //     }
        // }));
    };
    const handleRemoveMedicalDoc = (docUrl: string) => {
        setFormData((prev: any) => ({
            ...prev,
            documents: {
                ...prev.documents,
                medicalDoc: prev.documents.medicalDoc.filter((item: string) => item !== docUrl),
            },
        }));
    };
    const handleRemoveComplianceDoc = (docUrl: string) => {
        setFormData((prev: any) => ({
            ...prev,
            documents: {
                ...prev.documents,
                complianceDoc: prev.documents.complianceDoc.filter((item: string) => item !== docUrl),
            },
        }));
    };
    const handleComplianceRemove = (fileName: string) => {
        const updatedComplianceDocs = complianceDocuments.filter((doc) => doc.name !== fileName);
        setComplianceDocuments(updatedComplianceDocs);

        // setFormData(prev => ({
        //     ...prev,
        //     documents: {
        //         ...prev.documents,
        //         complianceDoc: updatedComplianceDocs
        //     }
        // }));
    };

    const addMedicationTag = () => {
        const trimmed = medication.trim();
        if (trimmed && !medicationTags.includes(trimmed)) {
            setMedicationTags([...medicationTags, trimmed]);
            setFormData(prev => ({
                ...prev,
                medicalInfo: {
                    ...prev.medicalInfo,
                    medicationAndTime: [...medicationTags, trimmed]
                }
            }));
            setMedication("");
        }
    };

    const removeMedicationTag = (index: number) => {
        // setMedicationTags(prev => prev.filter((_, i) => i !== index));
        const updated = [...medicationTags];
        updated.splice(index, 1);
        setMedicationTags(updated);
        setFormData(prev => ({
            ...prev,
            medicalInfo: {
                ...prev.medicalInfo,
                medicationAndTime: updated
            }
        }));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleInputChange = (section: string, updatedValue: any) => {
        setFormData((prev) => ({
            ...prev,
            [section]: updatedValue
        }));
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        // debugger
        const newFiles = event.target.files?.[0] || undefined;
        if (newFiles) {

            setPreviewUrl(URL.createObjectURL(newFiles)); // creates a preview blob URL
            setProfileImage(newFiles);
        }

        // const uniqueFiles = newFiles.filter(
        //     (newFile) => !profileImage.some((doc) => doc.name === newFile.name)
        // );
    }


    const getAvailableCarer = async () => {
        loader.showLoader()
        let payload = {
            startDate: formData.startDate,
            endDate: formData.endDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            repeatId: formData.repeatId,
            dayOfWeek: dayjs(formData.startDate, 'YYYY-MM-DD').day(), //weekday number
            dayOfMonth: dayjs(formData.startDate, 'YYYY-MM-DD').get('D'), //date of month
            customSlotArray: formData.customSlotArray //provide the dates if repest Id is custom
        }
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/carrier/v1/check_carrier_availability', payload)
            console.log(res);
            setCarerList(res?.data)
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }
    }

    useEffect(() => {
        if (formData.repeatId == '') return
        getAvailableCarer()

    }, [formData.repeatId, formData.customSlotArray, formData.startDate, formData.endDate, formData.startTime, formData.endTime])

    // Function to generate slots
    const generateSlots = (duration: any, selectedDate: any) => {
        const durationMinutes =
            duration === "30mins" ? 30 : duration === "1hour" ? 60 : 120;

        const startOfDay = dayjs(selectedDate).hour(0).minute(0); // 00:00
        const endOfDay = dayjs(selectedDate).add(1, "day").hour(0).minute(0); // next day 00:00
        const now = dayjs();

        const generatedSlots = [];
        let current = startOfDay;

        while (current.isBefore(endOfDay)) {
            const slotStart = current;
            const slotEnd = current.add(durationMinutes, "minute");

            if (slotEnd.isAfter(endOfDay)) break; // Don't exceed 24 hours

            // ✅ Skip past slots if today
            if (selectedDate === now.format("YYYY-MM-DD") && slotStart.isBefore(now)) {
                current = slotEnd;
                continue;
            }

            generatedSlots.push(
                `${slotStart.format("HH:mm")}-${slotEnd.format("HH:mm")}`
            );
            current = slotEnd;
        }

        return generatedSlots;
    };

    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const newSlots: any = generateSlots(formData.duration, formData.startDate);
        setSlots(newSlots);
        console.log(newSlots);


        if (newSlots.length > 0) {
            const [start, end] = newSlots[0].split("-");
            setFormData((prev) => ({ ...prev, startTime: start, endTime: end }));
        } else {
            // No slots available for today
            setFormData((prev) => ({ ...prev, startTime: "", endTime: "" }));
        }
    }, [formData.duration, formData.startDate]);

    const mapApiDataToForm = (apiData: any) => {
        return {
            clientId: apiData.clientId || '',
            carrierId: formData.carrierId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            duration: formData.duration,
            repeatId: formData.repeatId,
            dayOfWeek: formData.dayOfWeek,
            dayOfMonth: formData.dayOfMonth,
            customSlotArray: formData.customSlotArray,
            personalInfo: {
                name: apiData.personalInfo?.name || '',
                gender: apiData.personalInfo?.gender || '',
                dob: apiData.personalInfo?.dob ? dayjs(apiData.personalInfo.dob).format('YYYY-MM-DD') : '',
                clientNotes: apiData.personalInfo?.clientNotes || '',
                profileImage: apiData.personalInfo?.profileImage || '',
                typeOfCare: apiData.personalInfo?.typeOfCare || '',
                email: apiData.personalInfo?.email || '',
                mobileNumber: apiData.personalInfo?.mobileNumber || ''
            },
            relationInfo: {
                relativeName: apiData.relationInfo?.relativeName || '',
                relativeRelation: apiData.relationInfo?.relativeRelation || '',
                relativeNumber: apiData.relationInfo?.relativeNumber || ''
            },
            address: {
                street: apiData.address?.street || '',
                suburb: apiData.address?.suburb || '',
                state: apiData.address?.state || '',
                postCode: apiData.address?.postCode || '',
                locationUrl: apiData.address?.locationUrl || '',
            },
            ndis: {
                ndisNumber: apiData.ndis?.ndisNumber || '89000000122',
                ndisType: apiData.ndis?.ndisType || 'NDIS Participant (NDIS)'
            },
            documents: {
                medicalDoc: apiData.documents?.medicalDoc || [],
                complianceDoc: apiData.documents?.complianceDoc || []
            },
            medicalInfo: {
                diagnoses: apiData.medicalInfo?.diagnoses || '',
                allergy: apiData.medicalInfo?.allergy || [],
                medicationAndTime: apiData.medicalInfo?.medicationAndTime || [],
                mobilityNotes: apiData.medicalInfo?.mobilityNotes || '',
                emergencyPlan: apiData.medicalInfo?.emergencyPlan || ''
            }
        };
    };


    const getClientDetails = async () => {
        const res = await apiCall<any>(adminClient, 'GET', `/client/v1/get_client/${clientId}`)
        const mappedData = mapApiDataToForm(res.data);
        setAllergyTags(mappedData.medicalInfo.allergy)
        setMedicationTags(mappedData.medicalInfo.medicationAndTime)
        setFormData(mappedData);
        console.log(res);

    }

    const mapApiDataToFormForEdit = (apiData: any) => {
        return {
            clientId: apiData?.clientId,
            carrierId: apiData.carrierId?._id,
            startDate: apiData?.startDate,
            endDate: apiData?.endDate,
            startTime: apiData?.startTime,
            endTime: apiData?.endTime,
            duration: apiData?.duration,
            repeatId: apiData?.repeatId,
            dayOfWeek: apiData?.dayOfWeek,
            dayOfMonth: apiData?.dayOfMonth,
            customSlotArray: apiData?.customSlotArray,
            personalInfo: {
                name: apiData.personalInfo?.name || '',
                gender: apiData.personalInfo?.gender || '',
                dob: apiData.personalInfo?.dob ? dayjs(apiData.personalInfo.dob).format('YYYY-MM-DD') : '',
                clientNotes: apiData.personalInfo?.clientNotes || '',
                profileImage: apiData.personalInfo?.profileImage || '',
                typeOfCare: apiData.personalInfo?.typeOfCare || '',
                email: apiData.personalInfo?.email || '',
                mobileNumber: apiData.personalInfo?.mobileNumber || ''
            },
            relationInfo: {
                relativeName: apiData.relationInfo?.relativeName || '',
                relativeRelation: apiData.relationInfo?.relativeRelation || '',
                relativeNumber: apiData.relationInfo?.relativeNumber || ''
            },
            address: {
                street: apiData.address?.street,
                suburb: apiData.address?.suburb,
                state: apiData.address?.state,
                postCode: apiData.address?.postCode,
                locationUrl: apiData.address?.locationUrl,
            },
            ndis: {
                ndisNumber: apiData.ndis?.ndisNumber,
                ndisType: apiData.ndis?.ndisType
            },
            documents: {
                medicalDoc: apiData.documents?.medicalDoc || [],
                complianceDoc: apiData.documents?.complianceDoc || []
            },
            medicalInfo: {
                diagnoses: apiData.medicalInfo?.diagnoses || '',
                allergy: apiData.medicalInfo?.allergy || [],
                medicationAndTime: apiData.medicalInfo?.medicationAndTime || [],
                mobilityNotes: apiData.medicalInfo?.mobilityNotes || '',
                emergencyPlan: apiData.medicalInfo?.emergencyPlan || ''
            }
        };
    };

    const getSlotDetails = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'GET', `/slot/v1/get_slot_details/${slotId}`)
            console.log(res);
            // setSlotDetails(res?.data)
            const mappedData = mapApiDataToFormForEdit(res.data);
            setAllergyTags(mappedData.medicalInfo.allergy)
            setMedicationTags(mappedData.medicalInfo.medicationAndTime)
            setFormData(mappedData);
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }
    }

    useEffect(() => {
        getSlotDetails()
    }, [slotId])



    const uploadDocuments = async () => {
        const updatedData: any = { ...formData }; // local copy

        try {
            // Upload medical documents (1 API call)
            if (documents.length > 0) {
                const formDataMedical = new FormData();
                documents.forEach(file => formDataMedical.append("file", file));

                const res = await apiCall<any>(adminClient, "POST", "/doc/v1/upload_doc", formDataMedical);
                updatedData.documents = {
                    ...updatedData.documents,
                    medicalDoc: [...formData.documents.medicalDoc, ...res.documentId],
                };
            }

            // Upload compliance documents (1 API call)
            if (complianceDocuments.length > 0) {
                const formDataCompliance = new FormData();
                complianceDocuments.forEach(file => formDataCompliance.append("file", file));

                const res = await apiCall<any>(adminClient, "POST", "/doc/v1/upload_doc", formDataCompliance);
                updatedData.documents = {
                    ...updatedData.documents,
                    complianceDoc: [...formData.documents.complianceDoc, ...res.documentId],
                };
            }

            // Upload profile image (1 API call)
            if (profileImage) {
                const formDataProfile = new FormData();
                formDataProfile.append("file", profileImage);

                const res = await apiCall<any>(adminClient, "POST", "/doc/v1/upload_doc", formDataProfile);
                updatedData.personalInfo = {
                    ...updatedData.personalInfo,
                    profileImage: Array.isArray(res.documentId) ? res.documentId[0] : res.documentId,
                };
            }

            return updatedData;
        } catch (error) {
            console.error("Error uploading documents:", error);
            updatePopupStatus("error", "Upload Failed!", "Your documents upload has failed!", 4000);
            throw error;
        }
    };


    const handleBooking = async () => {
        // if (!profileImage) return;
        showPopup("Booking Processing", "Your booking has been initiated");

        try {
            updatePopupStatus("loading", "Uploading", "Documents are Uploading");
            // Upload files and get the complete form data
            const updatedFormData = await uploadDocuments();
            updatedFormData['status'] = true;

            if (slotId) {

                updatedFormData['allSlot'] = "false";
                updatedFormData['slotId'] = slotId;

                const res = await apiCall<any>(adminClient, "POST", "/slot/v1/update_slot", updatedFormData);
                console.log(res);
                updatePopupStatus("success", "Booking Updated!", "Your booking has been updated!", 4000);
            } else {

                const res = await apiCall<any>(adminClient, "POST", "/client/v1/create_client", updatedFormData);
                console.log(res);
                updatePopupStatus("success", "Booking Confirmed!", "Your booking has been confirmed!", 4000);
            }
            // Create client

            onSuccess();
        } catch (error) {
            console.error("Error booking:", error);
            updatePopupStatus("error", "Booking Error!", "Your booking has not been confirmed!", 4000);
        }
    };

    return (
        <div className="p-6">
            {/* Shiftcare ID */}
            {activeTab === 'personal' && <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Your Shift Buddy ID
                </label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={clientId}
                        placeholder="Enter shift buddy ID"
                        onChange={(e) => setClientId(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    <button className="px-8 py-1 bg-[#F2C7AC] text-primary text-sm rounded-full hover:bg-orange-300 transition-colors"
                        onClick={getClientDetails}
                    >
                        Enter
                    </button>
                </div>
            </div>}

            {/* Tabs */}
            <div className="flex justify-between items-center mb-6 border-b border-b-[#D4D4D4]">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'personal'
                            ? 'border-b-[3px] border-primary text-primary'
                            : ''
                            }`}
                    >
                        Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('medical')}
                        className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'medical'
                            ? 'border-b-[3px] border-primary text-primary'
                            : ''
                            }`}
                    >
                        Medical Info
                    </button>
                    <button
                        onClick={() => setActiveTab('complianceDoc')}
                        className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'complianceDoc'
                            ? 'border-b-[3px] border-primary text-primary'
                            : ''
                            }`}
                    >
                        Compliance Documents
                    </button>
                </div>
            </div>



            {activeTab === 'personal' && (
                <div className="space-y-6">
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Data</h3>

                            {/* Upload */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2" >Upload Pic</label>
                                <input type="file" onChange={handleProfileChange} hidden ref={fileInputRef} />
                                <label
                                    onClick={handleClick}
                                    className="block"
                                >
                                    {!profileImage && !formData.personalInfo.profileImage ? (
                                        // --- Upload UI ---
                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer block"
                                        >
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">Click to Upload</p>
                                            <p className="text-xs text-gray-500">(Max file size: 25 MB)</p>
                                        </div>
                                    ) : (
                                        // --- Image Preview ---
                                        <img
                                            src={
                                                profileImage
                                                    ? previewUrl // newly uploaded in Add/Edit
                                                    : formData.personalInfo.profileImage // existing image in Edit
                                            }
                                            alt="Preview"
                                            className="h-36 w-36 object-contain"
                                        />
                                    )}

                                </label>
                            </div>

                            {/* Type of Care */}
                            <div className="mb-4">
                                <ValidatedSelect
                                    label="Type of Care"
                                    value={formData.personalInfo.typeOfCare}
                                    onChange={(val) => handleInputChange("personalInfo", { ...formData.personalInfo, typeOfCare: val })}
                                    schema={fieldSchemas["personalInfo.typeOfCare"]}
                                    path="personalInfo.typeOfCare"
                                    icon={<Search className="h-5 w-5" />}   // ✅ icon injected
                                    options={[
                                        { label: "Select a type of care", value: "" },
                                        { value: "fever", label: "Fever" },
                                        { value: "blood_sample", label: "Blood Sample" },
                                        { value: "urine_sample", label: "Urine Sample" },
                                    ]}
                                />

                            </div>

                            {/* Scheduled Visit Time */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Visit Time</label>
                                <DateInput
                                    value={formData.startDate}
                                    onChange={(value) => {
                                        setFormData({ ...formData, startDate: value as string, dayOfMonth: dayjs(value as string, 'YYYY-MM-DD').get('D'), dayOfWeek: dayjs(value as string, 'YYYY-MM-DD').day() })
                                    }}
                                    dateFormat={'yyyy-mm-dd'}
                                    calendarMode={'dropdown'}
                                    selectionMode={'single'}
                                    readonly={true}
                                    placeholder={"Click to select date via calendar"}
                                    schema={fieldSchemas["startDate"]}
                                />
                            </div>


                            {/* Duration */}
                            <div className="mb-4 relative">
                                <ValidatedSelect
                                    label="Duration"
                                    value={formData.duration}
                                    onChange={(val) => setFormData({ ...formData, duration: val })}
                                    schema={fieldSchemas["duration"]}
                                    path="duration"
                                    icon={<Clock className="h-5 w-5" />}   // ✅ icon injected
                                    options={[
                                        { label: "30mins", value: "30mins" },
                                        { label: "1 hour", value: "1hour" },
                                        { label: "2 hours", value: "2hours" },
                                    ]}
                                />
                            </div>

                            {/* Select Time */}
                            <div className="mb-4">
                                <ValidatedSelect
                                    label="Select Time"
                                    value={`${formData.startTime}-${formData.endTime}`}
                                    onChange={(val) => {
                                        const [start, end] = val.split("-");
                                        setFormData({ ...formData, startTime: start, endTime: end });
                                    }}
                                    schema={fieldSchemas["timeSlot"]}
                                    path="timeSlot"
                                    options={
                                        slots.length > 0
                                            ? slots.map((slot: string) => ({ label: slot, value: slot }))
                                            : [{ label: "No slots available", value: "" }]
                                    }
                                />
                            </div>

                            {/* Repeat */}
                            <div className="mb-4">
                                <ValidatedSelect
                                    label="Repeat"
                                    value={formData.repeatId}
                                    onChange={(val) => setFormData({ ...formData, repeatId: val })}
                                    schema={fieldSchemas["repeatId"]}
                                    path="repeatId"
                                    options={repeatModes.map((mode: any) => ({
                                        label: mode.repeatType,
                                        value: mode._id,
                                    }))}
                                />

                            </div>

                            {formData.repeatId != '6854576f74ae23c01c0faf1a' && formData.repeatId != '685c39a134947853141c3e5f' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <DateInput
                                        value={formData.endDate}
                                        onChange={(value) => setFormData({ ...formData, endDate: value as string })}
                                        dateFormat={'yyyy-mm-dd'}
                                        calendarMode={'dropdown'}
                                        selectionMode={'single'}
                                        readonly={true}
                                        placeholder={"Click to select date via calendar"}
                                        schema={fieldSchemas["endDate"]}
                                    />

                                </div>
                            )}
                            {formData.repeatId == '685c39a134947853141c3e5f' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Dates</label>
                                    <DateInput
                                        value={formData.customSlotArray}
                                        onChange={(value) => setFormData({ ...formData, customSlotArray: value as string[] })}
                                        dateFormat={'yyyy-mm-dd'}
                                        calendarMode={'dropdown'}
                                        selectionMode={'multiple'}
                                        readonly={true}
                                        placeholder={"Click to select date via calendar"}
                                        schema={fieldSchemas["customSlotArray"]}
                                    />

                                    {formData.customSlotArray.length > 0 && (
                                        <div className="pt-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(showAll ? formData.customSlotArray : formData.customSlotArray.slice(0, 2)).map((date, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-purple-200 text-purple-800 text-xs flex gap-2 items-center rounded-full"
                                                    >
                                                        <span>{date}</span>
                                                        <X
                                                            className="h-3 w-3 cursor-pointer"
                                                            onClick={() => handleRemoveDate(date)}
                                                        />
                                                    </span>
                                                ))}

                                                {formData.customSlotArray.length > 2 && (
                                                    <span
                                                        className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full cursor-pointer"
                                                        onClick={toggleShowAll}
                                                    >
                                                        {showAll
                                                            ? "Show less"
                                                            : `+${formData.customSlotArray.length - 2} more`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Name */}
                            <div className="mb-4">
                                <ValidatedInput
                                    label="Name"
                                    value={formData.personalInfo.name}
                                    placeholder="Enter name"
                                    onChange={(val) =>
                                        handleInputChange("personalInfo", { ...formData.personalInfo, name: val })
                                    }
                                    schema={fieldSchemas["personalInfo.name"]}
                                    path="personalInfo.name"
                                />
                            </div>

                            {/* Gender */}
                            <div className="mb-4">

                                <ValidatedSelect
                                    label="Gender"
                                    value={formData.personalInfo.gender}
                                    onChange={(val) =>
                                        handleInputChange("personalInfo", { ...formData.personalInfo, gender: val })
                                    }
                                    schema={fieldSchemas["personalInfo.gender"]}
                                    path="personalInfo.gender"
                                    options={[
                                        { label: "Select gender", value: "" },
                                        { label: "Male", value: "Male" },
                                        { label: "Female", value: "Female" },
                                        { label: "Non Binary", value: "Non Binary" },
                                        { label: "Not Preferable", value: "Not Preferable" },
                                        { label: "Other", value: "Other" },
                                    ]}
                                />
                            </div>

                            {/* Date of Birth */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <DateInput
                                    value={formData.personalInfo.dob}
                                    onChange={(value) => handleInputChange('personalInfo', {
                                        ...formData.personalInfo,
                                        dob: value
                                    })}
                                    dateFormat={'yyyy-mm-dd'}
                                    calendarMode={'dropdown'}
                                    selectionMode={'single'}
                                    readonly={true}
                                    placeholder={"Click to select date via calendar"}
                                    schema={fieldSchemas["personalInfo.dob"]}
                                />
                            </div>

                            {/* Client Notes */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client Notes</label>
                                <textarea
                                    value={formData.personalInfo.clientNotes}
                                    placeholder="Enter client note"
                                    onChange={(e) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            clientNotes: e.target.value
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>

                            {/* Email */}
                            <div className="mb-4">
                                <ValidatedInput
                                    label="Email ID"
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.personalInfo.email}
                                    onChange={(val) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            email: val
                                        })
                                    }
                                    schema={fieldSchemas["personalInfo.email"]}
                                    path="personalInfo.email"
                                />
                            </div>

                            {/* Phone No */}
                            <div className="mb-4">
                                <ValidatedInput
                                    label="Phone No."
                                    type="tel"
                                    placeholder="Enter phone no."
                                    value={formData.personalInfo.mobileNumber}
                                    onChange={(val) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            mobileNumber: val
                                        })
                                    }
                                    schema={fieldSchemas["personalInfo.mobileNumber"]}
                                    path="personalInfo.mobileNumber"
                                />
                            </div>

                            {/* Family Member Name */}
                            <div className="mb-4">
                                <ValidatedInput
                                    label="Family Member Name"
                                    type="text"
                                    placeholder="Enter member name"
                                    value={formData.relationInfo.relativeName}
                                    onChange={(val) =>
                                        handleInputChange('relationInfo', {
                                            ...formData.relationInfo,
                                            relativeName: val
                                        })
                                    }
                                    schema={fieldSchemas["relationInfo.relativeName"]}
                                    path="relationInfo.relativeName"
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="mb-4">
                                <ValidatedInput
                                    label="Emergency Contact Number"
                                    placeholder="Enter emergency number"
                                    type="tel"
                                    value={formData.relationInfo.relativeNumber}
                                    onChange={(val) =>
                                        handleInputChange('relationInfo', {
                                            ...formData.relationInfo,
                                            relativeNumber: val
                                        })
                                    }
                                    schema={fieldSchemas["relationInfo.relativeNumber"]}
                                    path="relationInfo.relativeNumber"
                                />
                            </div>

                            {/* Relation */}
                            <div className="mb-4">
                                <ValidatedInput
                                    label="Family Member Relation"
                                    placeholder="Enter member relation"
                                    type="text"
                                    value={formData.relationInfo.relativeRelation}
                                    onChange={(val) =>
                                        handleInputChange('relationInfo', {
                                            ...formData.relationInfo,
                                            relativeRelation: val
                                        })
                                    }
                                    schema={fieldSchemas["relationInfo.relativeRelation"]}
                                    path="relationInfo.relativeRelation"
                                />
                            </div>

                            {/* Address */}
                            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Address</h3>
                            {/* {(Object.keys(formData.address) as (keyof typeof formData.address)[]).map((field) => ( */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                                <PlacesAutocomplete formData={formData} setFormData={setFormData} />
                            </div>
                            <div className="mb-4" >
                                {/* <PlacesAutocomplete /> */}

                                <ValidatedInput

                                    label="Suburb"
                                    type="text"
                                    placeholder="Enter suburb"
                                    value={formData.address.suburb}
                                    onChange={(val) =>
                                        handleInputChange("address", {
                                            ...formData.address,
                                            suburb: val,
                                        })
                                    }
                                    schema={fieldSchemas['address.suburb']}   // ✅ schema lookup
                                    path={'address.suburb'}                   // ✅ pass correct path
                                />
                            </div>
                            <div className="mb-4" >
                                <ValidatedInput

                                    label="State"
                                    type="text"
                                    placeholder="Enter state"
                                    value={formData.address.state}
                                    onChange={(val) =>
                                        handleInputChange("address", {
                                            ...formData.address,
                                            state: val,
                                        })
                                    }
                                    schema={fieldSchemas['address.state']}   // ✅ schema lookup
                                    path={'address.state'}                   // ✅ pass correct path
                                />
                            </div>
                            <div className="mb-4" >
                                <ValidatedInput

                                    label="Postal Code"
                                    type="text"
                                    placeholder="Enter zipcode"
                                    value={formData.address.postCode}
                                    onChange={(val) =>
                                        handleInputChange("address", {
                                            ...formData.address,
                                            postCode: val,
                                        })
                                    }
                                    schema={fieldSchemas['address.postCode']}   // ✅ schema lookup
                                    path={'address.postCode'}                   // ✅ pass correct path
                                />
                            </div>
                            {/* ))} */}

                            {/* NDIS */}
                            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">SCHEME</h3>
                            <div>
                                <ValidatedSelect
                                    label="Scheme Type"
                                    value={formData.ndis.ndisType}
                                    onChange={(val) =>
                                        handleInputChange('ndis', {
                                            ...formData.ndis,
                                            ndisType: val
                                        })
                                    }
                                    schema={fieldSchemas["ndis.ndisType"]}
                                    path="ndis.ndisType"
                                    options={[{ label: "Select Scheme Type", value: "" },].concat(ndisTypes.map((ndis: any) => ({
                                        label: ndis.ndisType,
                                        value: ndis._id,
                                    })))}
                                />
                            </div>
                            <div className="mb-4">
                                <ValidatedInput
                                    label="NDIS Number"
                                    type="text"
                                    placeholder="Enter ndis no."
                                    value={formData.ndis.ndisNumber}
                                    onChange={(val) =>
                                        handleInputChange('ndis', {
                                            ...formData.ndis,
                                            ndisNumber: val
                                        })
                                    }
                                    schema={fieldSchemas["ndis.ndisNumber"]}
                                    path="ndis.ndisNumber"
                                />
                            </div>


                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                            onClick={() => setActiveTab('medical')}>
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'medical' && (
                <div className="grid grid-cols-2 gap-6 ">
                    {/* Medical Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Medical info</h3>

                        {/* Diagnoses */}
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Diagnoses</label>
                            <input
                                type="text"
                                value={formData.medicalInfo.diagnoses}
                                onChange={(e) => handleInputChange("diagnoses", e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}

                            <ValidatedInput
                                label="Diagnoses"
                                type="text"
                                placeholder="Enter diagnoses"
                                value={formData.medicalInfo.diagnoses}
                                onChange={(val) =>
                                    handleInputChange("medicalInfo", {
                                        ...formData.medicalInfo,
                                        diagnoses: val,
                                    })
                                }
                                schema={fieldSchemas["medicalInfo.diagnoses"]}
                                path="medicalInfo.diagnoses"
                            />
                        </div>

                        {/* Allergy */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                                Allergy
                                <button
                                    type="button"
                                    onClick={addAllergyTag}
                                    className="text-purple-700 hover:text-purple-900 text-lg"
                                    title="Add Allergy"
                                >
                                    <Plus size={16} />
                                </button>
                            </label>
                            {/* <input
                                type="text"
                                value={allergyInput}
                                onChange={(e) => setAllergyInput(e.target.value)}
                                placeholder="Type allergies"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}
                            <ValidatedInput
                                label=""
                                type="text"
                                placeholder="Enter allergies"
                                value={allergyInput}
                                onChange={setAllergyInput}
                                schema={z.string().optional()} // only validate tags list, not typing
                                path="medicalInfo.allergies"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {allergyTags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800">
                                        {tag}
                                        <button
                                            onClick={() => removeAllergyTag(index)}
                                            className="ml-2 text-primary hover:text-purple-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>


                        {/* Medications */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                                Medications with Dosage & Timing
                                <button
                                    type="button"
                                    onClick={addMedicationTag}
                                    className="text-purple-700 hover:text-purple-900 text-lg"
                                    title="Add Allergy"
                                >
                                    <Plus size={16} />
                                </button>
                            </label>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Medications with Dosage & Timing</label> */}
                            {/* <input
                                type="text"
                                value={medication}
                                onChange={(e) => setMedication(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}
                            <ValidatedInput
                                label=""
                                type="text"
                                placeholder="Enter medications"
                                value={medication}
                                onChange={setMedication}
                                schema={z.string().optional()} // same logic: validate tags array, not typing
                                path="medicalInfo.medications"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {medicationTags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                                        {tag}
                                        <button className="ml-2 text-purple-600 hover:text-purple-800" onClick={() => removeMedicationTag(i)}>
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Mobility Notes */}
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Mobility Notes</label>
                            <input
                                type="text"
                                value={formData.medicalInfo.mobilityNotes}
                                onChange={(e) => handleInputChange("mobilityNotes", e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}
                            <ValidatedInput
                                label="Mobility Notes"
                                type="text"
                                placeholder="Enter mobility notes"
                                value={formData.medicalInfo.mobilityNotes}
                                onChange={(val) =>
                                    handleInputChange("medicalInfo", {
                                        ...formData.medicalInfo,
                                        mobilityNotes: val,
                                    })
                                }
                                schema={fieldSchemas["medicalInfo.mobilityNotes"]}
                                path="medicalInfo.mobilityNotes"
                            />
                        </div>

                        {/* Emergency Plan */}
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Plan</label>
                            <input
                                type="text"
                                value={formData.medicalInfo.emergencyPlan}
                                onChange={(e) => handleInputChange("emergencyPlan", e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}
                            <ValidatedInput
                                label="Emergency Plan"
                                type="text"
                                placeholder="Enter emergency plan"
                                value={formData.medicalInfo.emergencyPlan}
                                onChange={(val) =>
                                    handleInputChange("medicalInfo", {
                                        ...formData.medicalInfo,
                                        emergencyPlan: val,
                                    })
                                }
                                schema={fieldSchemas["medicalInfo.emergencyPlan"]}
                                path="medicalInfo.emergencyPlan"
                            />
                        </div>

                        {/* Carer */}
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Carer</label>
                            <select
                                value={formData.carrierId}
                                onChange={(e) => setFormData({ ...formData, carrierId: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            >
                                <option value={''}>Select Carer</option>
                                {carerList.map((carer: any, index: number) => (
                                    <option key={index} value={carer?._id}>{carer?.name}</option>

                                ))}
                            </select> */}
                            <ValidatedSelect
                                label="Carer"
                                value={formData.carrierId}
                                onChange={(val) => setFormData({ ...formData, carrierId: val })}
                                schema={fieldSchemas["carrierId"]}
                                path="carrierId"
                                options={carerList.map((carer: any) => ({
                                    label: carer?.name,
                                    value: carer?._id,
                                }))}
                                placeholder="Select Carer"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* Documents */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Document</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.documents.medicalDoc.map((url: string, index: number) => {
                                            // Extract filename from URL
                                            const fileName = url.split("/").pop() || "unknown-file";

                                            return (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                                                >
                                                    📄 {fileName}
                                                    <button
                                                        onClick={() => handleRemoveMedicalDoc(url)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                        {documents.map((file, index) => (
                                            <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                                📄 {file.name}
                                                <button onClick={() => handleRemove(file.name)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleAddClick}
                                        className="px-4 py-2 bg-[#F2C7AC] text-primary rounded-full hover:bg-[#ecb08a] text-sm"
                                    >
                                        Add Document
                                    </button>
                                    <input
                                        type="file"
                                        ref={documentRef}
                                        onChange={handleFileChange}
                                        multiple
                                        hidden
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Book Button */}
                        <div className="flex justify-end">
                            <button onClick={() => setActiveTab('complianceDoc')} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-purple-800">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'complianceDoc' && (

                <div className="flex flex-col justify-between min-h-[calc(100vh-10.5rem))]">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Document</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.documents.complianceDoc.map((url: string, index: number) => {
                                    // Extract filename from URL
                                    const fileName = url.split("/").pop() || "unknown-file";

                                    return (
                                        <span
                                            key={index}
                                            className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            📄 {fileName}
                                            <button
                                                onClick={() => handleRemoveComplianceDoc(url)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    );
                                })}
                                {complianceDocuments.map((file, index) => (
                                    <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                        📄 {file.name}
                                        <button onClick={() => handleComplianceRemove(file.name)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                                    </span>
                                ))}
                            </div>
                            <button
                                onClick={handleAddComplianceClick}
                                className="px-4 py-2 bg-[#F2C7AC] text-primary rounded-full hover:bg-[#ecb08a] text-sm"
                            >
                                Add Document
                            </button>
                            <input
                                type="file"
                                ref={complianceDocumentRef}
                                onChange={handleComplianceFileChange}
                                multiple
                                hidden
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleBooking} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-purple-800">
                            Book Slot
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};