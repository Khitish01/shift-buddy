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
import { fieldSchemas } from "@/lib/validationSchemas";
import { ValidatedInput } from "../ui/ValidatedInput";
import { ValidatedSelect } from "../ui/ValidatedSelect";
import PlacesAutocomplete from "../common/PlacesAutocomplete";

interface CarerProps {
    onSuccess: () => void;
    carerId?: string;
}

export const AddCarer: React.FC<CarerProps> = ({ carerId, onSuccess }) => {
    const { showPopup, updatePopupStatus } = usePopup();
    const [activeTab, setActiveTab] = useState('personal');
    const [profileImage, setProfileImage] = useState<File>();
    const [documentsPolicyCheck, setDocumentsPolicyCheck] = useState<File | null>();
    const [documentsFirstAid, setDocumentsFirstAid] = useState<File | null>();
    const [ndisTypes, setNdisTypes] = useState<any[]>([])
    const loader = useTopLoader();
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
            familyMemberName: "",
            familyMemberRelation: ""
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
    const [carerDetails, setCarerDetails] = useState<any>();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputPolicyCheckRef = useRef<HTMLInputElement>(null);
    const fileInputFirstAidRef = useRef<HTMLInputElement>(null);


    const mapApiDataToFormForEdit = (apiData: any) => {
        return {
            profileImage: apiData?.profileImage,
            email: apiData?.email,
            mobileNumber: apiData?.mobileNumber,
            DOB: dayjs(apiData?.DOB).format('YYYY-MM-DD'),
            name: apiData?.name,
            gender: apiData?.gender,
            receiverEmail: apiData?.receiverEmail,
            createEmail: apiData?.createEmail,
            password: apiData?.password,
            confirmPass: apiData?.password,
            shiftTiming: apiData?.shiftTiming,
            employementType: apiData?.employementType,
            vehicle: apiData?.vehicle,
            contactDetails: {

                emergencyContactNumber: apiData?.contactDetails?.emergencyContactNumber,
                familyMemberName: apiData?.contactDetails?.familyMemberName,
                familyMemberRelation: apiData?.contactDetails?.familyMemberRelation
            },
            address: {
                street: apiData?.address?.street,
                suburb: apiData?.address?.suburb,
                state: apiData?.address?.state,
                postalCode: apiData?.address?.postalCode
            },
            ndis: {
                ndisNumber: apiData?.ndis?.ndisNumber,
                ndisType: apiData?.ndis?.ndisType
            },
            additionalDetails: {
                taxFileNumber: apiData?.additionalDetails?.taxFileNumber,
                AbnNumber: apiData?.additionalDetails?.AbnNumber,
                workersScreeningCheck: apiData?.additionalDetails?.workersScreeningCheck,
                workingWithChildernCheck: apiData?.additionalDetails?.workingWithChildernCheck,
                policeCheck: apiData?.additionalDetails?.policeCheck,
                firstAid: apiData?.additionalDetails?.firstAid
            },
            documents: {
                uploadPoliceCheck: {
                    docId: apiData?.documents?.uploadPoliceCheck?.docId,
                    expiryDate: apiData?.documents?.uploadPoliceCheck?.expiryDate
                },
                uploadFirstAidCertificate: {
                    docId: apiData?.documents?.uploadFirstAidCertificate?.docId,
                    expiryDate: apiData?.documents?.uploadFirstAidCertificate?.expiryDate
                }
            }

        };
    };

    const getCarerDetails = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', `/carrier/v1/carrier_details`, { carrierId: carerId })
            console.log(res);
            // setSlotDetails(res?.data)
            const mappedData = mapApiDataToFormForEdit(res.data);
            setFormData(mappedData);
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }
    }

    useEffect(() => {
        getCarerDetails()
    }, [carerId])
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
        // getRepeatMode()
        getNdisType()
    }, [])

    const uploadDocuments = async () => {
        const updatedData: any = { ...formData }; // local copy
        // showPopup('Uploading', "Documents are Uploading"); // Optional message & duration
        try {

            if (documentsPolicyCheck) {
                const formData = new FormData();
                // for (let file of documents) {

                formData.append('file', documentsPolicyCheck);
                // }
                const res = await apiCall<any>(adminClient, 'POST', '/doc/v1/upload_doc', formData)
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
                const res = await apiCall<any>(adminClient, 'POST', '/doc/v1/upload_doc', formData)
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

                const res = await apiCall<any>(adminClient, "POST", "/doc/v1/upload_doc", formDataProfile);
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
            if (carerId) {
                updatedFormData["carrierId"] = carerId

                const res = await apiCall<any>(adminClient, 'POST', '/carrier/v1/update_carrier', updatedFormData)
                updatePopupStatus('success', 'Carer Updated!', "Carer has been updated successfully!", 4000); // Optional message & duration
            } else {

                const res = await apiCall<any>(adminClient, 'POST', '/carrier/v1/create_carrier', updatedFormData)
                updatePopupStatus('success', 'Carer Onboarded!', "Carer has been onboarded successfully!", 4000); // Optional message & duration
            }
            // console.log(res)
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
                                        {!profileImage && !formData.profileImage ? (
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
                                                        : formData.profileImage // existing image in Edit
                                                }
                                                alt="Preview"
                                                className="h-36 w-36 object-contain"
                                            />
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
                                        schema={fieldSchemas["personalInfo.dob"]}
                                    />
                                </div>

                                {/* Name */}
                                <div className="">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    /> */}
                                    <ValidatedInput
                                        label="Name"
                                        value={formData.name}
                                        onChange={(val) =>
                                            setFormData({ ...formData, name: val })
                                        }
                                        schema={fieldSchemas["personalInfo.name"]}
                                        path="personalInfo.name"
                                    />
                                </div>

                                {/* Gender */}
                                <div className="">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
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
                                    </select> */}
                                    <ValidatedSelect
                                        label="Gender"
                                        value={formData.gender}
                                        onChange={(val) =>
                                            setFormData({ ...formData, gender: val })
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

                                {/* Shift Timing */}
                                <div className="">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Shift Timing</label>
                                    <select
                                        value={formData.shiftTiming}
                                        onChange={(e) =>
                                            setFormData({ ...formData, shiftTiming: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Morning Shift">Morning Shift</option>
                                    </select> */}

                                    <ValidatedSelect
                                        label="Shift Timing"
                                        value={formData.shiftTiming}
                                        onChange={(val) =>
                                            setFormData({ ...formData, shiftTiming: val })
                                        }
                                        schema={fieldSchemas["carer.shiftTiming"]}
                                        path="carer.shiftTiming"
                                        options={[
                                            { label: "Select Shift Timing", value: "" },
                                            { label: "Morning Shift", value: "Morning Shift" },

                                        ]}
                                    />
                                </div>

                                {/* Employment Type */}
                                <div className="">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                                    <select
                                        value={formData.employementType}
                                        onChange={(e) =>
                                            setFormData({ ...formData, employementType: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Full Time">Full Time</option>
                                    </select> */}

                                    <ValidatedSelect
                                        label="Employment Type"
                                        value={formData.employementType}
                                        onChange={(val) =>
                                            setFormData({ ...formData, employementType: val })
                                        }
                                        schema={fieldSchemas["carer.employementType"]}
                                        path="carer.employementType"
                                        options={[
                                            { label: "Select Employment Type", value: "" },
                                            { label: "Full Time", value: "Full Time" },

                                        ]}
                                    />
                                </div>

                                {/* NDIS */}
                                <h3 className="text-lg font-medium text-gray-900 mt-6 ">NDIS</h3>
                                <div className="">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">NDIS No.</label>
                                    <input
                                        type="text"
                                        value={formData.ndis.ndisNumber}
                                        onChange={(e) =>
                                            handleInputChange('ndis', { ...formData.ndis, ndisNumber: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    /> */}

                                    <ValidatedInput
                                        label="NDIS No."
                                        value={formData.ndis.ndisNumber}
                                        onChange={(val) =>
                                            handleInputChange('ndis', { ...formData.ndis, ndisNumber: val })
                                        }
                                        schema={fieldSchemas["ndis.ndisNumber"]}
                                        path="ndis.ndisNumber"
                                    />
                                </div>
                                <div>
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">NDIS types</label>
                                    <select
                                        value={formData.ndis.ndisType}
                                        onChange={(e) =>
                                            handleInputChange('ndis', { ...formData.ndis, ndisType: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="NDIS Participant (NDIS)">NDIS Participant (NDIS)</option>
                                    </select> */}


                                    <ValidatedSelect
                                        label="NDIS types"
                                        value={formData.ndis.ndisType}
                                        onChange={(val) =>
                                            handleInputChange('ndis', { ...formData.ndis, ndisType: val })
                                        }
                                        schema={fieldSchemas["ndis.ndisType"]}
                                        path="ndis.ndisType"
                                        options={[{ label: "Select NDIS Type", value: "" },].concat(ndisTypes.map((ndis: any) => ({
                                            label: ndis.ndisType,
                                            value: ndis._id,
                                        })))}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>

                                {/* Email */}
                                <div className="mb-4">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    /> */}
                                    <ValidatedInput
                                        label="Email ID"
                                        type="email"
                                        value={formData.email}
                                        onChange={(val) =>
                                            setFormData({ ...formData, email: val })
                                        }
                                        schema={fieldSchemas["personalInfo.email"]}
                                        path="personalInfo.email"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="mb-4">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Phone No.</label>
                                    <input
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={(e) =>
                                            setFormData({ ...formData, mobileNumber: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        /> */}
                                    <ValidatedInput
                                        label="Phone No."
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={(val) =>
                                            setFormData({ ...formData, mobileNumber: val })
                                        }
                                        schema={fieldSchemas["personalInfo.mobileNumber"]}
                                        path="personalInfo.mobileNumber"
                                    />
                                </div>

                                {/* Emergency Contact */}
                                <div className="mb-4">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number</label>
                                    <input
                                        type="tel"
                                        value={formData.contactDetails.emergencyContactNumber}
                                        onChange={(e) =>
                                            handleInputChange('contactDetails', { ...formData.contactDetails, emergencyContactNumber: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        /> */}
                                    <ValidatedInput
                                        label="Emergency Contact Number"
                                        type="tel"
                                        value={formData.contactDetails.emergencyContactNumber}
                                        onChange={(val) =>
                                            handleInputChange('contactDetails', { ...formData.contactDetails, emergencyContactNumber: val })
                                        }
                                        schema={fieldSchemas["relationInfo.relativeNumber"]}
                                        path="relationInfo.relativeNumber"
                                    />
                                </div>

                                {/* Family Member Name */}
                                <div className="mb-4">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Family Member Name</label>
                                    <input
                                        type="text"
                                        value={formData.contactDetails.familyMemberName}
                                        onChange={(e) =>
                                            handleInputChange('relationInfo', { ...formData.contactDetails, familyMemberName: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    /> */}
                                    <ValidatedInput
                                        label="Family Member Name"
                                        value={formData.contactDetails.familyMemberName}
                                        onChange={(val) =>
                                            handleInputChange('contactDetails', { ...formData.contactDetails, familyMemberName: val })
                                        }
                                        schema={fieldSchemas["relationInfo.relativeName"]}
                                        path="relationInfo.relativeName"
                                    />
                                </div>

                                {/* Family Member Relation */}
                                <div className="mb-4">
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Family Member Relation</label>
                                    <input
                                        type="text"
                                        value={formData.contactDetails.familyMemberRelation}
                                        onChange={(e) =>
                                            handleInputChange('relationInfo', { ...formData.contactDetails, familyMemberRelation: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    /> */}
                                    <ValidatedInput
                                        label="Family Member Relation"
                                        value={formData.contactDetails.familyMemberRelation}
                                        onChange={(val) =>
                                            handleInputChange('contactDetails', { ...formData.contactDetails, familyMemberRelation: val })
                                        }
                                        schema={fieldSchemas["relationInfo.relativeRelation"]}
                                        path="relationInfo.relativeRelation"
                                    />
                                </div>

                                {/* Address */}
                                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Adress</h3>
                                {/* {(Object.keys(formData.address) as (keyof typeof formData.address)[]).map((field) => (
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
                                ))} */}

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
                                        value={formData.address.postalCode}
                                        onChange={(val) =>
                                            handleInputChange("address", {
                                                ...formData.address,
                                                postalCode: val,
                                            })
                                        }
                                        schema={fieldSchemas['address.postCode']}   // ✅ schema lookup
                                        path={'address.postCode'}                   // ✅ pass correct path
                                    />
                                </div>
                                {/* ))} */}
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
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">Tax File Number</label>
                                <input
                                    type="text"
                                    value={formData.additionalDetails.taxFileNumber || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, taxFileNumber: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                /> */}

                                <ValidatedInput
                                    label="Tax File Number"
                                    value={formData.additionalDetails.taxFileNumber}
                                    onChange={(val) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, taxFileNumber: val })
                                    }
                                    schema={fieldSchemas["additionalDetails.taxFileNumber"]}
                                    path="additionalDetails.taxFileNumber"
                                />
                            </div>

                            {/* ABN */}
                            <div>
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">ABN</label>
                                <input
                                    type="text"
                                    value={formData.additionalDetails.AbnNumber || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, AbnNumber: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                /> */}

                                <ValidatedInput
                                    label="ABN"
                                    value={formData.additionalDetails.AbnNumber}
                                    onChange={(val) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, AbnNumber: val })
                                    }
                                    schema={fieldSchemas["additionalDetails.AbnNumber"]}
                                    path="additionalDetails.AbnNumber"
                                />
                            </div>

                            {/* Screening Checks */}
                            <div>
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">Screening Checks</label>
                                <input
                                    type="text"
                                    value={formData.additionalDetails.workersScreeningCheck || ""}
                                    onChange={(e) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, workersScreeningCheck: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                /> */}

                                <ValidatedInput
                                    label="Screening Checks"
                                    value={formData.additionalDetails.workersScreeningCheck}
                                    onChange={(val) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, workersScreeningCheck: val })
                                    }
                                    schema={fieldSchemas["additionalDetails.workersScreeningCheck"]}
                                    path="additionalDetails.workersScreeningCheck"
                                />
                            </div>

                            {/* Working with Children Check */}
                            <div>
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">Working with Children Check</label>
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
                                </select> */}
                                <ValidatedSelect
                                    label="Working with Children Check"
                                    value={formData.additionalDetails.workingWithChildernCheck}
                                    onChange={(val) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, workingWithChildernCheck: val })
                                    }
                                    schema={fieldSchemas["additionalDetails.workingWithChildernCheck"]}
                                    path="additionalDetails.workingWithChildernCheck"
                                    options={[
                                        { label: "Select", value: "" },
                                        { label: "Yes", value: "Yes" },
                                        { label: "No", value: "No" },
                                    ]}
                                />
                            </div>

                            {/* Police Check */}
                            <div>
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">Police Check</label>
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
                                </select> */}
                                <ValidatedSelect
                                    label="Police Check"
                                    value={formData.additionalDetails.policeCheck}
                                    onChange={(val) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, policeCheck: val })
                                    }
                                    schema={fieldSchemas["additionalDetails.policeCheck"]}
                                    path="additionalDetails.policeCheck"
                                    options={[
                                        { label: "Select", value: "" },
                                        { label: "Yes", value: "Yes" },
                                        { label: "No", value: "No" },
                                    ]}
                                />
                            </div>

                            {/* First Aid */}
                            <div>
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">First Aid</label>
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
                                </select> */}
                                <ValidatedSelect
                                    label="First Aid"
                                    value={formData.additionalDetails.firstAid}
                                    onChange={(val) =>
                                        handleInputChange('additionalDetails', { ...formData.additionalDetails, firstAid: val })
                                    }
                                    schema={fieldSchemas["additionalDetails.firstAid"]}
                                    path="additionalDetails.firstAid"
                                    options={[
                                        { label: "Select", value: "" },
                                        { label: "Yes", value: "Yes" },
                                        { label: "No", value: "No" },
                                    ]}
                                />
                            </div>

                            {/* Assign Vehicle */}
                            <div>
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">Assign Vehicle</label>
                                <select
                                    value={formData.vehicle || ""}
                                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="">Select</option>
                                    <option value="OD01AK0344">OD01AK0344</option>
                                    <option value="OD33Y6025">OD33Y6025</option>
                                </select> */}
                                <ValidatedSelect
                                    label="Assign Vehicle"
                                    value={formData.vehicle}
                                    onChange={(val) =>
                                        setFormData({ ...formData, vehicle: val })
                                    }
                                    schema={fieldSchemas["vehicle"]}
                                    path="vehicle"
                                    options={[
                                        { label: "Select", value: "" },
                                        { label: "OD01AK0344", value: "OD01AK0344" },
                                        { label: "OD33Y6025", value: "OD33Y6025" },
                                    ]}
                                />
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
                                {documentsPolicyCheck || formData.documents.uploadPoliceCheck.docId != '' ? (
                                    <div className="flex items-center gap-2 mt-3 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>

                                        {/* Show uploaded name or extract from existing URL */}
                                        {documentsPolicyCheck?.name ||
                                            (() => {
                                                const url = formData.documents.uploadPoliceCheck.docId;
                                                const fileName = url?.split("/").pop() || "unknown-file";
                                                return fileName;
                                            })()}

                                        <button
                                            className="ml-2 text-purple-500 hover:text-purple-700"
                                            onClick={() => setDocumentsPolicyCheck(null)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : null}

                                {/* Custom Date Picker */}
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Set Expiry Dates</p>
                                    <DateInput
                                        value={formData.documents.uploadPoliceCheck.expiryDate}
                                        onChange={(value) => {
                                            // handleInputChange('documents.uploadPoliceCheck', { ...formData.documents.uploadPoliceCheck, expiryDate: value })
                                            setFormData({ ...formData, documents: { ...formData.documents, uploadPoliceCheck: { ...formData.documents.uploadPoliceCheck, expiryDate: value as string } } })
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

                                {/* Uploaded file tag
                                {documentsFirstAid && <div className="flex items-center gap-2 mt-3 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {documentsFirstAid?.name}
                                    <button className="ml-2 text-purple-500 hover:text-purple-700" onClick={() => setDocumentsFirstAid(null)}>×</button>
                                </div>} */}


                                {documentsFirstAid || formData.documents.uploadFirstAidCertificate.docId != '' ? (
                                    <div className="flex items-center gap-2 mt-3 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>

                                        {/* Show uploaded name or extract from existing URL */}
                                        {documentsFirstAid?.name ||
                                            (() => {
                                                const url = formData.documents.uploadFirstAidCertificate.docId;
                                                const fileName = url?.split("/").pop() || "unknown-file";
                                                return fileName;
                                            })()}

                                        <button
                                            className="ml-2 text-purple-500 hover:text-purple-700"
                                            onClick={() => setDocumentsFirstAid(null)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : null}

                                {/* Custom Date Picker */}
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Set Expiry Dates</p>
                                    <DateInput
                                        value={formData.documents.uploadFirstAidCertificate.expiryDate}
                                        onChange={(value) => {
                                            setFormData({ ...formData, documents: { ...formData.documents, uploadFirstAidCertificate: { ...formData.documents.uploadFirstAidCertificate, expiryDate: value as string } } })
                                            // handleInputChange('documents.uploadFirstAidCertificate', { ...formData.documents.uploadFirstAidCertificate, expiryDate: value })
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
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Email</label>
                            <input
                                type="text"
                                value={formData.receiverEmail || ""}
                                onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}

                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}
                            <ValidatedInput
                                label="Receiver Email"
                                type="email"
                                value={formData.receiverEmail}
                                onChange={(val) =>
                                    setFormData({ ...formData, receiverEmail: val })
                                }
                                schema={fieldSchemas["receiverEmail"]}
                                path="receiverEmail"
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Create Email</label>
                            <input
                                type="text"
                                value={formData.createEmail || ""}
                                onChange={(e) => setFormData({ ...formData, createEmail: e.target.value })}

                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}
                            <ValidatedInput
                                label="Create Email"
                                type="email"
                                value={formData.createEmail}
                                onChange={(val) =>
                                    setFormData({ ...formData, createEmail: val })
                                }
                                schema={fieldSchemas["createEmail"]}
                                path="createEmail"
                            />
                        </div>

                        {/* ABN */}
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={formData.password || ""}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            /> */}
                            <ValidatedInput
                                label="New Password"
                                type="password"
                                value={formData.password}
                                onChange={(val) =>
                                    setFormData({ ...formData, password: val })
                                }
                                schema={fieldSchemas["password"]}
                                path="password"
                            />
                        </div>

                        {/* Screening Checks */}
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={formData.confirmPass || ""}
                                onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                /> */}
                            <ValidatedInput
                                label="Confirm New Password"
                                type="password"
                                value={formData.confirmPass}
                                onChange={(val) =>
                                    setFormData({ ...formData, confirmPass: val })
                                }
                                schema={fieldSchemas["confirmPass"]}
                                path="confirmPass"
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
                            {carerId ? 'Update' : 'Add'} Carer
                        </button>

                    )}

                </div>
                <div className="text-right">
                </div>
            </div>
        </div >
    );
};