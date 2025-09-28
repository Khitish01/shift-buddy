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
import { AutocompleteInput } from "../ui/AutoCompleteInput";

interface CarerProps {
    onSuccess: () => void;
    vehicle?: any;
}

export const AddVehicle: React.FC<CarerProps> = ({ vehicle, onSuccess }) => {
    const { showPopup, updatePopupStatus } = usePopup();
    const [activeTab, setActiveTab] = useState('personal');
    const [vehicleImage, setVehicleImage] = useState<File>();
    const [documentsPolicyCheck, setDocumentsPolicyCheck] = useState<File[]>([]);
    const [documentsFirstAid, setDocumentsFirstAid] = useState<File[]>([]);
    const [ndisTypes, setNdisTypes] = useState<any[]>([])
    const [carerName, setCarerName] = useState<string>('')
    const loader = useTopLoader();
    const [formData, setFormData] = useState({
        modelName: "",
        registrationNo: "",
        modelNumber: "",
        onboardDate: dayjs().format('YYYY-MM-DD'),
        assignee: "",
        assigneeMobile: "",
        status: "",
        vehicleImage: "",
        documents: {
            uploadPoliceCheck: [{ fileUrl: '', expiryDate: "" }],
            uploadFirstAidCertificate: [{ fileUrl: '', expiryDate: "" }]
        }
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputPolicyCheckRef = useRef<HTMLInputElement>(null);
    const fileInputFirstAidRef = useRef<HTMLInputElement>(null);
    const [debouncedSearch, setDebouncedSearch] = useState(carerName);
    const [carersList, setCarersList] = useState<any>([]);

    const mapApiDataToFormForEdit = (apiData: any) => {
        const uploadPoliceCheck = apiData?.documents?.uploadPoliceCheck?.length > 0 ? apiData.documents.uploadPoliceCheck.map((item: any) => ({ fileUrl: item.fileUrl, expiryDate: dayjs(item.expiryDate).format('YYYY-MM-DD') })) : [{ fileUrl: '', expiryDate: "" }];
        const uploadFirstAidCertificate = apiData?.documents?.uploadFirstAidCertificate?.length > 0 ? apiData.documents.uploadFirstAidCertificate.map((item: any) => ({ fileUrl: item.fileUrl, expiryDate: dayjs(item.expiryDate).format('YYYY-MM-DD') })) : [{ fileUrl: '', expiryDate: "" }];
        return {
            modelName: apiData?.modelName,
            registrationNo: apiData?.registrationNo,
            modelNumber: apiData?.modelNumber,
            onboardDate: apiData?.onboardDate,
            assignee: apiData?.assignee?._id,
            assigneeMobile: apiData?.assignee?.mobileNumber,
            status: apiData?.status,
            vehicleImage: apiData?.vehicleImage,
            documents: {
                uploadPoliceCheck: uploadPoliceCheck,
                uploadFirstAidCertificate: uploadFirstAidCertificate
            }
        };
    };

    // const getCarerDetails = async () => {
    //     loader.showLoader()
    //     try {
    //         const res = await apiCall<any>(adminClient, 'POST', `/carrier/v1/carrier_details`, { carrierId: vehicle })
    //         console.log(res);
    //         // setSlotDetails(res?.data)
    //         const mappedData = mapApiDataToFormForEdit(res.data);
    //         setFormData(mappedData);
    //         // setTotalCount(res?.total)
    //     } catch (error) {
    //         console.error('Error setting role:', error)
    //     } finally {
    //         loader.hideLoader()
    //     }
    // }

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(carerName);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [carerName]);

    const searchCarer = async () => {
        try {
            const result = await apiCall<any>(adminClient, 'POST', '/carrier/v1/get_carrier_master', {
                search: debouncedSearch
            })
            console.log(result);
            setCarersList(result.data)

        } catch (error) {
            console.error('Error setting role:', error)
        }
    }

    useEffect(() => {
        searchCarer()
    }, [debouncedSearch])

    useEffect(() => {
        // getCarerDetails()
        console.log(vehicle);
        const mappedData = mapApiDataToFormForEdit(vehicle);
        setFormData(mappedData);
        setCarerName(mappedData.assignee ? (vehicle.assignee?.name || '') : '');

    }, [vehicle])
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
            setVehicleImage(newFiles);
        }
    }
    const handleFirstAid = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        if (newFiles.length > 0) {
            setDocumentsFirstAid(prev => [...prev, ...newFiles]);
        }
    }
    const handlePolicyCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        if (newFiles.length > 0) {
            setDocumentsPolicyCheck(prev => [...prev, ...newFiles]);
        }
    }

    const removePolicyFile = (index: number) => {
        setDocumentsPolicyCheck(prev => prev.filter((_, i) => i !== index));
    }

    const removeFirstAidFile = (index: number) => {
        setDocumentsFirstAid(prev => prev.filter((_, i) => i !== index));
    }

    const uploadDocuments = async () => {
        const updatedData: any = { ...formData }; // local copy
        // showPopup('Uploading', "Documents are Uploading"); // Optional message & duration
        try {

            if (documentsPolicyCheck.length > 0) {
                const formData = new FormData();
                for (let file of documentsPolicyCheck) {
                    formData.append('file', file);
                }
                const res = await apiCall<any>(adminClient, 'POST', '/doc/v1/upload_doc', formData)
                console.log('policy check documents', res);
                const docIds = Array.isArray(res.documentId) ? res.documentId : [res.documentId];
                updatedData.documents.uploadPoliceCheck = docIds.map((docId: string, index: number) => ({
                    fileUrl: docId,
                    expiryDate: updatedData.documents.uploadPoliceCheck[0]?.expiryDate
                }));
            }

            if (documentsFirstAid.length > 0) {
                const formData = new FormData();
                for (let file of documentsFirstAid) {
                    formData.append('file', file);
                }
                const res = await apiCall<any>(adminClient, 'POST', '/doc/v1/upload_doc', formData)
                console.log('first aid documents', res);
                const docIds = Array.isArray(res.documentId) ? res.documentId : [res.documentId];
                updatedData.documents.uploadFirstAidCertificate = docIds.map((docId: string, index: number) => ({
                    fileUrl: docId,
                    expiryDate: updatedData.documents.uploadFirstAidCertificate[0]?.expiryDate
                }));
            }

            if (vehicleImage) {
                const formDataProfile = new FormData();
                formDataProfile.append("file", vehicleImage);

                const res = await apiCall<any>(adminClient, "POST", "/doc/v1/upload_doc", formDataProfile);
                updatedData.vehicleImage = Array.isArray(res.documentId) ? res.documentId[0] : res.documentId
            }

            return updatedData;
            // console.log(res)
        } catch (error) {
            console.error('Error setting role:', error)
            updatePopupStatus("error", "Upload Failed!", "Your documents upload has failed!", 4000);
            throw error;
        }
    }

    const handleAddVehicle = async () => {
        // After booking logic

        showPopup("Vehicle Onboarding", "Vehicle onboarding process");
        // loader.showLoader()

        try {
            updatePopupStatus("loading", "Uploading", "Documents are Uploading");

            const updatedFormData = await uploadDocuments();
            if (vehicle) {
                updatedFormData["vehicleId"] = vehicle._id

                const res = await apiCall<any>(adminClient, 'POST', '/vehicle/v1/updateVehicle', updatedFormData)
                updatePopupStatus('success', 'Vehicle Updated!', "Vehicle has been updated successfully!", 4000); // Optional message & duration
            } else {

                const res = await apiCall<any>(adminClient, 'POST', '/vehicle/v1/addVehicle', updatedFormData)
                updatePopupStatus('success', 'Vehicle Onboarded!', "Vehicle has been onboarded successfully!", 4000); // Optional message & duration
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

            <div className="min-h-[calc(100vh-15rem)]">


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="space-y-5">
                        {/* Upload */}
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Pic</label>
                            <input type="file" onChange={handleProfileChange} hidden ref={fileInputRef} />
                            <label onClick={handleClick} className="block">
                                {!vehicleImage && !formData.vehicleImage ? (
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
                                            vehicleImage
                                                ? previewUrl // newly uploaded in Add/Edit
                                                : formData.vehicleImage // existing image in Edit
                                        }
                                        alt="Preview"
                                        className="h-36 w-36 object-contain"
                                    />
                                )}
                            </label>
                        </div>
                        {/* Tax File Number */}
                        <div>
                            <ValidatedInput
                                label="Model Name"
                                placeholder="Enter model no"
                                value={formData.modelName}
                                onChange={(val) =>
                                    setFormData(prev => ({ ...prev, assignee: '', modelName: val }))
                                    // handleInputChange('additionalDetails', { ...formData.additionalDetails, taxFileNumber: val })
                                }
                                schema={fieldSchemas["modelName"]}
                                path="modelName"
                            />
                        </div>

                        {/* ABN */}
                        <div>
                            <ValidatedInput
                                label="Registration No."
                                placeholder="Enter regd no."
                                value={formData.registrationNo}
                                onChange={(val) =>
                                    setFormData(prev => ({ ...prev, assignee: '', registrationNo: val }))
                                    // handleInputChange('additionalDetails', { ...formData.additionalDetails, AbnNumber: val })
                                }
                                schema={fieldSchemas["registrationNo"]}
                                path="registrationNo"
                            />
                        </div>

                        {/* Screening Checks */}
                        <div>
                            <ValidatedInput
                                label="Model No."
                                placeholder="Enter model no."
                                value={formData.modelNumber}
                                onChange={(val) =>
                                    setFormData(prev => ({ ...prev, assignee: '', modelNumber: val }))
                                    // handleInputChange('additionalDetails', { ...formData.additionalDetails, workersScreeningCheck: val })
                                }
                                schema={fieldSchemas["modelNumber"]}
                                path="modelNumber"
                            />
                        </div>

                        {/* Working with Children Check */}
                        <div>
                            <AutocompleteInput
                                label="Assignee"
                                value={carerName}
                                onChange={(value, selectedCarer) => {
                                    setCarerName(value)
                                    console.log(selectedCarer);

                                    if (selectedCarer) {
                                        setFormData(prev => ({ ...prev, assignee: selectedCarer._id, assigneeMobile: selectedCarer.mobileNumber }))
                                    } else {
                                        setFormData(prev => ({ ...prev, assignee: '', assigneeMobile: '' }))

                                    }
                                }}
                                schema={fieldSchemas["carerName"]}
                                placeholder="Type carer name"
                                carers={carersList}
                            />
                        </div>

                        {/* Police Check */}
                        <div>

                            <ValidatedInput
                                label="Assignee Contact"
                                placeholder="Enter phone no."
                                value={formData.assigneeMobile}
                                onChange={(val) =>
                                    setFormData(prev => ({ ...prev, assignee: '', assigneeMobile: val }))
                                    // handleInputChange('additionalDetails', { ...formData.additionalDetails, workersScreeningCheck: val })
                                }
                                schema={fieldSchemas["assigneeMobile"]}
                                path="assigneeMobile"
                            />
                        </div>

                        {/* First Aid */}
                        <div>

                            <ValidatedSelect
                                label="Status"
                                value={formData.status}
                                onChange={(val) =>
                                    setFormData(prev => ({ ...prev, assignee: '', status: val }))
                                    // handleInputChange('additionalDetails', { ...formData.additionalDetails, firstAid: val })
                                }
                                schema={fieldSchemas["status"]}
                                path="status"
                                options={[
                                    { label: "Select", value: "" },
                                    { label: "Active", value: "Active" },
                                    { label: "Inactive", value: "Inactive" },
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
                            {!(documentsPolicyCheck.length > 0 || (formData.documents.uploadPoliceCheck.length > 0 && formData.documents.uploadPoliceCheck[0].fileUrl)) && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition">
                                    <div className="flex flex-col items-center" onClick={handleClickPolicyCheck}>
                                        <div className="bg-[#F5F5F5] p-3 rounded-full mb-2">
                                            <DocumentUploadIcon />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Click to Upload</p>
                                        <p className="text-xs text-gray-500">(Max. File size: 25 MB)</p>
                                    </div>
                                </div>
                            )}
                            <input type="file" onChange={handlePolicyCheck} hidden ref={fileInputPolicyCheckRef} multiple />

                            {/* Uploaded files tags */}
                            <div className="space-y-2 mt-3">
                                {documentsPolicyCheck.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 w-fit bg-blue-100 text-blue-700 px-3 py-2 rounded-full">
                                        <div className="flex gap-2 items-center">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-sm flex-1">{file.name}</span>
                                        </div>
                                        <button
                                            className="w-6 h-6 text-gray-600 flex items-center justify-center text-lg font-bold cursor-pointer"
                                            onClick={() => removePolicyFile(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {formData.documents.uploadPoliceCheck.length > 0 && formData.documents.uploadPoliceCheck.map((doc, index) => {
                                    if (!doc.fileUrl) return null;
                                    const fileName = doc.fileUrl.split("/").pop() || "Policecheck.png";
                                    return (
                                        <div key={`existing-${index}`} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-sm flex-1">{fileName}</span>
                                        </div>
                                    );
                                })}
                                {(documentsPolicyCheck.length > 0 || (formData.documents.uploadPoliceCheck.length > 0 && formData.documents.uploadPoliceCheck[0].fileUrl)) && (
                                    <button
                                        onClick={handleClickPolicyCheck}
                                        className="w-8 h-8 bg-[#F2C7AC] text-white rounded-full flex items-center justify-center hover:bg-orange-500 mx-auto"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Custom Date Picker */}
                            <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Set Expiry Dates</p>
                                <DateInput
                                    value={formData.documents.uploadPoliceCheck?.[0]?.expiryDate || ""}
                                    onChange={(value) => {
                                        const updatedDocs = formData.documents.uploadPoliceCheck.map(doc => ({
                                            ...doc,
                                            expiryDate: value as string
                                        }));
                                        setFormData({ ...formData, documents: { ...formData.documents, uploadPoliceCheck: updatedDocs } });
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
                            {!(documentsFirstAid.length > 0 || (formData.documents.uploadFirstAidCertificate.length > 0 && formData.documents.uploadFirstAidCertificate[0].fileUrl)) && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition">
                                    <div className="flex flex-col items-center" onClick={handleClickFirstAid}>
                                        <div className="bg-[#F5F5F5] p-3 rounded-full mb-2">
                                            <DocumentUploadIcon />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Click to Upload</p>
                                        <p className="text-xs text-gray-500">(Max. File size: 25 MB)</p>
                                    </div>
                                </div>
                            )}
                            <input type="file" onChange={handleFirstAid} hidden ref={fileInputFirstAidRef} multiple />

                            {/* Uploaded files tags */}
                            <div className="space-y-2 mt-3">
                                {documentsFirstAid.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-full w-fit">
                                        <div className="flex gap-1 items-center">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-sm flex-1">{file.name}</span>
                                        </div>
                                        <button
                                            className="w-6 h-6 rounded-full text-gray-600 flex items-center justify-center text-lg font-bold"
                                            onClick={() => removeFirstAidFile(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {formData.documents.uploadFirstAidCertificate.length > 0 && formData.documents.uploadFirstAidCertificate.map((doc, index) => {
                                    if (!doc.fileUrl) return null;
                                    const fileName = doc.fileUrl.split("/").pop() || "FirstAid.png";
                                    return (
                                        <div key={`existing-${index}`} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-sm flex-1">{fileName}</span>
                                        </div>
                                    );
                                })}
                                {(documentsFirstAid.length > 0 || (formData.documents.uploadFirstAidCertificate.length > 0 && formData.documents.uploadFirstAidCertificate[0].fileUrl)) && (
                                    <button
                                        onClick={handleClickFirstAid}
                                        className="w-8 h-8 bg-[#F2C7AC] text-white rounded-full flex items-center justify-center hover:bg-orange-500 mx-auto"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Custom Date Picker */}
                            <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Set Expiry Dates</p>
                                <DateInput
                                    value={formData.documents.uploadFirstAidCertificate?.[0]?.expiryDate || ""}
                                    onChange={(value) => {
                                        const updatedDocs = formData.documents.uploadFirstAidCertificate.map(doc => ({
                                            ...doc,
                                            expiryDate: value as string
                                        }));
                                        setFormData({ ...formData, documents: { ...formData.documents, uploadFirstAidCertificate: updatedDocs } });
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




            </div>

            <div className="mt-5">
                <div className="flex justify-end">

                    <button
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                        onClick={() => handleAddVehicle()}
                    >
                        Continue
                    </button>


                </div>
                <div className="text-right">
                </div>
            </div>
        </div >
    );
};