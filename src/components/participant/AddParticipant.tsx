'use client'
import { usePopup } from "@/context/PopupContext";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiCall";
import { Calendar, Clock, FileText, Plus, Search, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DateInput } from "../common/date-input";
import dayjs from "dayjs";
import { adminClient } from "@/lib/apiClient";
import { ValidatedInput } from "../ui/ValidatedInput";
import { fieldSchemas } from "@/lib/validationSchemas";
import PlacesAutocomplete from "../common/PlacesAutocomplete";
import { ValidatedSelect } from "../ui/ValidatedSelect";
import z from "zod";

interface AddParticipantProps {
    // isOpen: boolean;
    onSuccess: () => void;
    clientId?: string;
    // avatar: string
    // children: React.ReactNode;
    // width?: string;
    // onBack?: () => void; // optional back button handler
    // isBackButton?: boolean
}

export const AddParticipant: React.FC<AddParticipantProps> = ({ clientId, onSuccess }) => {
    const { showPopup, updatePopupStatus } = usePopup();
    const [activeTab, setActiveTab] = useState('personal');
    const [allergyInput, setAllergyInput] = useState("");
    const [allergyTags, setAllergyTags] = useState<string[]>([]);
    const [medication, setMedication] = useState("");
    const [medicationTags, setMedicationTags] = useState<string[]>([]);
    const [profileImage, setProfileImage] = useState<File>();
    const documentRef = useRef<HTMLInputElement | null>(null);
    const complianceDocumentRef = useRef<HTMLInputElement | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [complianceDocuments, setComplianceDocuments] = useState<File[]>([]);
    const loader = useTopLoader();

    const [ndisTypes, setNdisTypes] = useState<any[]>([])
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
            // typeOfCare: '',
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

    const handleRemoveComplianceDoc = (docUrl: string) => {
        setFormData((prev: any) => ({
            ...prev,
            documents: {
                ...prev.documents,
                complianceDoc: prev.documents.complianceDoc.filter((item: string) => item !== docUrl),
            },
        }));
    };
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
        getNdisType()
    }, [])

    const handleRemoveMedicalDoc = (docUrl: string) => {
        setFormData((prev: any) => ({
            ...prev,
            documents: {
                ...prev.documents,
                medicalDoc: prev.documents.medicalDoc.filter((item: string) => item !== docUrl),
            },
        }));
    };


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

    const handleAddParticipant = async () => {
        // After booking logic

        showPopup('Participant Onboarding', "Participant has been onboarding!"); // Optional message & duration

        // loader.showLoader()

        try {
            updatePopupStatus("loading", "Uploading", "Documents are Uploading");
            const updatedFormData = await uploadDocuments();

            if (clientId) {
                // updatedFormData['clientId'] = clientId
                const res = await apiCall<any>(adminClient, 'POST', '/client/v1/update_client', updatedFormData)
                updatePopupStatus('success', 'Participant Edited', "Participant has been edited successfully", 4000); // Optional message & duration
            } else {
                const res = await apiCall<any>(adminClient, 'POST', '/client/v1/create_only_client', updatedFormData)
                updatePopupStatus('success', 'Participant Onboarded', "Participant has been onboarded successfully", 4000); // Optional message & duration
            }
            // console.log(res)
            onSuccess()
        } catch (error) {
            console.error('Error setting role:', error)
            updatePopupStatus('error', 'Onboarding Failed!', "Participant has not been onboarded successfully", 4000); // Optional message & duration
        }



        // setTimeout(() => {
        //     updatePopupStatus('success', 'Booking Confirmed!', "Your booking has been confirmed!", 4000); // Optional message & duration
        // }, 1000)
    };

    const mapApiDataToFormForEdit = (apiData: any) => {
        return {
            clientId: apiData?._id,
            personalInfo: {
                name: apiData.personalInfo?.name || '',
                gender: apiData.personalInfo?.gender || '',
                dob: apiData.personalInfo?.dob ? dayjs(apiData.personalInfo.dob).format('YYYY-MM-DD') : '',
                // clientNotes: apiData.personalInfo?.clientNotes || '',
                profileImage: apiData.personalInfo?.profileImage || '',
                // typeOfCare: apiData.personalInfo?.typeOfCare || '',
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
            const res = await apiCall<any>(adminClient, 'GET', `/client/v1/get_client/${clientId}`)
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
    }, [clientId])

    return (
        <div className="p-6">
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


                            {/* Name */}
                            <div className="mb-4">
                                <ValidatedInput
                                    label="Name"
                                    placeholder="Enter name"
                                    value={formData.personalInfo.name}
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
                                    type="tel"
                                    placeholder="Enter emergency number"
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
                                    type="text"
                                    placeholder="Enter member relation"
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
                        <button onClick={handleAddParticipant} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-purple-800">
                            Book Slot
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};