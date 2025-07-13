'use client'
import { usePopup } from "@/context/PopupContext";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiClient";
import { Calendar, Clock, FileText, Plus, Search, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DateInput } from "../common/date-input";
import dayjs from "dayjs";

export const AddParticipant: React.FC = () => {
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
    const [documents, setDocuments] = useState<File[]>([]);
    const [complianceDocuments, setComplianceDocuments] = useState<File[]>([]);
    const loader = useTopLoader();
    const [multipleValue, setMultipleValue] = useState<string[]>([])
    const [carerList, setCarerList] = useState<any[]>([])
    const [formData, setFormData] = useState({
        clientId: '',
        // carrierId: '',
        // startDate: dayjs().format('YYYY-MM-DD'),
        // endDate: dayjs().format('YYYY-MM-DD'),
        // startTime: '09:30',
        // endTime: '10:00',
        // duration: '30mins',
        // repeatId: '',
        // dayOfWeek: dayjs().day(), //weekday number
        // dayOfMonth: dayjs().get('D'), //date of month
        // customSlotArray: [] as string[],
        personalInfo: {
            name: '',
            gender: '',
            dob: '',
            // clientNotes: '',
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
            postCode: ''
        },
        ndis: {
            ndisNumber: '89000000122',
            ndisType: 'NDIS Participant (NDIS)'
        },
        documents: {
            medicalDoc: [],
            complianceDoc: []
        },
        medicalInfo: {
            diagnoses: 'sdfsdfs',
            allergy: allergyTags,
            medicationAndTime: medicationTags,
            mobilityNotes: 'asfasfasf',
            emergencyPlan: 'gfghdfhdf'
        }
    });
    const [showAll, setShowAll] = useState(false);

    // const handleRemoveDate = (dateToRemove: string) => {
    //     const updatedDates = formData.customSlotArray.filter((date) => date !== dateToRemove)
    //     // setMultipleValue((prev) => prev.filter((date) => date !== dateToRemove));
    //     // formData.customSlotArray
    //     setFormData({ ...formData, customSlotArray: updatedDates })
    // };

    // const toggleShowAll = () => {
    //     setShowAll((prev) => !prev);
    // };

    // const getRepeatMode = async () => {
    //     loader.showLoader()
    //     try {
    //         const res = await apiCall<any>('GET', '/master/v1/get_repeat_mode')
    //         console.log(res);
    //         setRepeatModes(res?.data)
    //         // setTotalCount(res?.total)
    //     } catch (error) {
    //         console.error('Error setting role:', error)
    //     } finally {
    //         loader.hideLoader()
    //     }
    // }
    // useEffect(() => {
    //     getRepeatMode()

    // }, [])
    // useEffect(() => {
    //     console.log(repeatModes.filter((x: any) => x.repeatType == 'Does not repeat')?.[0]?._id);

    //     setFormData(prev => ({
    //         ...prev,
    //         repeatId: repeatModes.filter((x: any) => x.repeatType == 'Does not repeat')?.[0]?._id
    //     }))
    // }, [repeatModes])

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


    // const getAvailableCarer = async () => {
    //     loader.showLoader()
    //     let payload = {
    //         startDate: formData.startDate,
    //         endDate: formData.endDate,
    //         startTime: formData.startTime,
    //         endTime: formData.endTime,
    //         repeatId: formData.repeatId,
    //         dayOfWeek: dayjs(formData.startDate, 'YYYY-MM-DD').day(), //weekday number
    //         dayOfMonth: dayjs(formData.startDate, 'YYYY-MM-DD').get('D'), //date of month
    //         customSlotArray: formData.customSlotArray //provide the dates if repest Id is custom
    //     }
    //     try {
    //         const res = await apiCall<any>('POST', '/carrier/v1/check_carrier_availability', payload)
    //         console.log(res);
    //         setCarerList(res?.data)
    //         // setTotalCount(res?.total)
    //     } catch (error) {
    //         console.error('Error setting role:', error)
    //     } finally {
    //         loader.hideLoader()
    //     }
    // }

    // useEffect(() => {
    //     if (formData.repeatId == '') return
    //     getAvailableCarer()

    // }, [formData.repeatId, formData.customSlotArray, formData.startDate, formData.endDate, formData.startTime, formData.endTime])

    const uploadDocuments = async () => {

        showPopup('Uploading', "Documents are Uploading"); // Optional message & duration
        try {

            if (documents.length > 0) {
                const formData = new FormData();
                for (let file of documents) {

                    formData.append('file', file);
                }
                const res = await apiCall<any>('POST', '/doc/v1/upload_doc', formData)
                console.log('medical documents', res);
                setFormData(prev => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        medicalDoc: res.documentId
                    }
                }));

            }

            if (complianceDocuments.length > 0) {
                const formData = new FormData();
                for (let file of complianceDocuments) {

                    formData.append('file', file);
                }
                const res = await apiCall<any>('POST', '/doc/v1/upload_doc', formData)
                console.log('compliance documents', res);
                setFormData(prev => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        complianceDoc: res.documentId
                    }
                }));

            }


            // console.log(res)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            // loader.hideLoader()
            updatePopupStatus('success', 'Booking Confirmed!', "Your booking has been confirmed!", 4000); // Optional message & duration
        }
    }

    const handleAddParticipant = async () => {
        // After booking logic

        showPopup('Booking Processing', "Your booking has been initiated"); // Optional message & duration

        // loader.showLoader()

        try {
            await uploadDocuments();
            const res = await apiCall<any>('POST', '/client/v1/create_client', formData)
            console.log(res)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            // loader.hideLoader()
            updatePopupStatus('success', 'Booking Confirmed!', "Your booking has been confirmed!", 4000); // Optional message & duration
        }



        // setTimeout(() => {
        //     updatePopupStatus('success', 'Booking Confirmed!', "Your booking has been confirmed!", 4000); // Optional message & duration
        // }, 1000)
    };

    return (
        <div className="p-6">
            {/* Shiftcare ID */}
            {/* {activeTab === 'personal' && <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Your Shiftcare ID
                </label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={formData.clientId}
                        onChange={(e) => handleInputChange('clientId', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    <button className="px-8 py-1 bg-[#F2C7AC] text-primary text-sm rounded-full hover:bg-orange-300 transition-colors">
                        Enter
                    </button>
                </div>
            </div>} */}

            {/* Tabs */}
            <div className="flex justify-between items-center mb-6 border-b border-b-[#D4D4D4]">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'personal'
                            ? 'border-b-[3px] border-primary'
                            : ''
                            }`}
                    >
                        Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('medical')}
                        className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'medical'
                            ? 'border-b-[3px] border-primary'
                            : ''
                            }`}
                    >
                        Medical Info
                    </button>
                    <button
                        onClick={() => setActiveTab('complianceDoc')}
                        className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'complianceDoc'
                            ? 'border-b-[3px] border-primary'
                            : ''
                            }`}
                    >
                        Compliance Documents
                    </button>
                </div>
                {/* Delete Icon */}
                {/* <div className="flex justify-end">
                    <button className="text-red-500 hover:text-red-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div> */}
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
                                    {!profileImage ? (
                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer block">
                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">Click to Upload</p>
                                            <p className="text-xs text-gray-500">(Max file size: 25 MB)</p>
                                        </div>

                                    ) : (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-36 w-36 object-contain"
                                        />
                                    )}
                                </label>
                            </div>

                            {/* Type of Care */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Care</label>
                                {/* <Search className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" size={16} /> */}
                                <input
                                    type="text"
                                    placeholder="Type to search"
                                    value={formData.personalInfo.typeOfCare}
                                    onChange={(e) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            typeOfCare: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Scheduled Visit Time */}
                            {/* <div className="mb-4">
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
                                />
                            </div> */}


                            {/* Duration */}
                            {/* <div className="mb-4 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                <Clock className="absolute left-3 top-12 h-5 w-5 transform -translate-y-1/2 text-gray-400" size={16} />
                                <select
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="30mins">30mins</option>
                                    <option value="1hour">1 hour</option>
                                    <option value="2hours">2 hours</option>
                                </select>
                            </div> */}

                            {/* Select Time */}
                            {/* <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                                <select
                                    value={`${formData.startTime}-${formData.endTime}`}
                                    onChange={(e) => {
                                        const [start, end] = e.target.value.split('-');
                                        setFormData({ ...formData, startTime: start, endTime: end });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="09:30-10:00">9:30am - 10:00am</option>
                                </select>
                            </div> */}

                            {/* Repeat */}
                            {/* <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
                                <select
                                    value={formData.repeatId}
                                    onChange={(e) => setFormData({ ...formData, repeatId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    {repeatModes.map((mode: any, index: number) => (
                                        <option key={index} value={mode._id}>{mode.repeatType}</option>

                                    ))}
                                </select>
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
                            )} */}

                            {/* Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.personalInfo.name}
                                    onChange={(e) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            name: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Gender */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    value={formData.personalInfo.gender}
                                    onChange={(e) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            gender: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
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
                                />
                            </div>

                            {/* Address */}
                            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Address</h3>
                            {['street', 'suburb', 'state', 'postCode'].map((field) => (
                                <div className="mb-4" key={field}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
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

                            {/* Client Notes */}
                            {/* <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client Notes</label>
                                <textarea
                                    value={formData.personalInfo.clientNotes}
                                    onChange={(e) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            clientNotes: e.target.value
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div> */}
                        </div>

                        {/* Right Column */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                                <input
                                    type="email"
                                    value={formData.personalInfo.email}
                                    onChange={(e) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            email: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Phone No */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone No.</label>
                                <input
                                    type="tel"
                                    value={formData.personalInfo.mobileNumber}
                                    onChange={(e) =>
                                        handleInputChange('personalInfo', {
                                            ...formData.personalInfo,
                                            mobileNumber: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Family Member Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Family Member Name</label>
                                <input
                                    type="text"
                                    value={formData.relationInfo.relativeName}
                                    onChange={(e) =>
                                        handleInputChange('relationInfo', {
                                            ...formData.relationInfo,
                                            relativeName: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.relationInfo.relativeNumber}
                                    onChange={(e) =>
                                        handleInputChange('relationInfo', {
                                            ...formData.relationInfo,
                                            relativeNumber: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Relation */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Family Member Relation</label>
                                <input
                                    type="text"
                                    value={formData.relationInfo.relativeRelation}
                                    onChange={(e) =>
                                        handleInputChange('relationInfo', {
                                            ...formData.relationInfo,
                                            relativeRelation: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>



                            {/* NDIS */}
                            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">NDIS</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">NDIS Number</label>
                                <input
                                    type="text"
                                    value={formData.ndis.ndisNumber}
                                    onChange={(e) =>
                                        handleInputChange('ndis', {
                                            ...formData.ndis,
                                            ndisNumber: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">NDIS Type</label>
                                <select
                                    value={formData.ndis.ndisType}
                                    onChange={(e) =>
                                        handleInputChange('ndis', {
                                            ...formData.ndis,
                                            ndisType: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="NDIS Participant (NDIS)">NDIS Participant (NDIS)</option>
                                </select>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Diagnoses</label>
                            <input
                                type="text"
                                value={formData.medicalInfo.diagnoses}
                                onChange={(e) => handleInputChange("diagnoses", e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
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
                            <input
                                type="text"
                                value={allergyInput}
                                onChange={(e) => setAllergyInput(e.target.value)}
                                placeholder="Type allergies"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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
                            <input
                                type="text"
                                value={medication}
                                onChange={(e) => setMedication(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobility Notes</label>
                            <input
                                type="text"
                                value={formData.medicalInfo.mobilityNotes}
                                onChange={(e) => handleInputChange("mobilityNotes", e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Emergency Plan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Plan</label>
                            <input
                                type="text"
                                value={formData.medicalInfo.emergencyPlan}
                                onChange={(e) => handleInputChange("emergencyPlan", e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Carer */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Carer</label>
                            <select
                                value={formData.carrierId}
                                onChange={(e) => setFormData({ ...formData, carrierId: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            >
                                <option value={''}>Select Carer</option>
                                {carerList.map((carer: any, index: number) => (
                                    <option key={index} value={carer?._id}>{carer?.name}</option>

                                ))}
                            </select>
                        </div> */}
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
                            <button onClick={uploadDocuments} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-purple-800">
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
                        <button onClick={handleAddParticipant} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-purple-800">
                            Add Participant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};