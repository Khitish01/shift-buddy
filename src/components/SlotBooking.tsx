import { usePopup } from "@/context/PopupContext";
import { Calendar, Clock, FileText, Plus, Search, Upload } from "lucide-react";
import { useRef, useState } from "react";

export const BookSlotContent: React.FC = () => {
    const { showPopup } = usePopup();
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
        shiftcareId: '56099',
        emailId: 'Smith Emason',
        phoneNo: 'Father',
        familyMember: 'Father',
        contactNumber: '09989891019',
        street: '45,new, USA',
        suburb: '45,new, USA',
        state: '45,new, USA',
        postcode: '45,new, USA',
        ndisNumber: '45,new, USA',
        typeOfCare: '',
        scheduledDate: '12.05.1992',
        duration: '30mins',
        name: 'Smith Emason',
        gender: 'Male',
        dateOfBirth: '12.05.1992',
        clientNotes: 'Smith',
        // Medical Info fields
        diagnoses: 'None',
        allergies: 'None',
        medications: 'IBM 60 - Morning',
        mobilityNotes: 'None',
        emergencyPlan: 'Dose 30',
        carer: 'Erman Watson',
        repeat: 'daily'
    });

    const [medicationTags, setMedicationTags] = useState(['IBM 60 - M', 'IBM 100-N']);
    // const [documentTags, setDocumentTags] = useState(['Scan.png', 'Report.png']);

    const documentRef = useRef<HTMLInputElement | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        const uniqueFiles = newFiles.filter(
            (newFile) => !documents.some((doc) => doc.name === newFile.name)
        );
        setDocuments([...documents, ...uniqueFiles]);
    };

    const handleAddClick = () => {
        documentRef.current?.click();
    };

    const handleRemove = (fileName: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.name !== fileName));
    };

    const removeMedicationTag = (index: number) => {
        setMedicationTags(prev => prev.filter((_, i) => i !== index));
    };

    // const removeDocumentTag = (index: number) => {
    //     setDocumentTags(prev => prev.filter((_, i) => i !== index));
    // };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBooking = () => {
    // After booking logic
    showPopup("Your booking has been confirmed!", 4000); // Optional message & duration
  };

    return (
        <div className="p-6">
            {/* Shiftcare ID */}
            {activeTab === 'personal' && <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Your Shiftcare ID
                </label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={formData.shiftcareId}
                        onChange={(e) => handleInputChange('shiftcareId', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    <button className="px-8 py-1 bg-[#F2C7AC] text-primary text-sm rounded-full hover:bg-orange-300 transition-colors">
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
                </div>
                {/* Delete Icon */}
                <div className="flex justify-end">
                    <button className="text-red-500 hover:text-red-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>



            {activeTab === 'personal' && (
                <div className="space-y-6">
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column - Personal Data */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal data</h3>

                            {/* Upload Pic */}
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    htmlFor="file"
                                >
                                    Upload Pic
                                </label>
                                <input type="file" hidden id="file" ref={fileInputRef} />
                                <div
                                    onClick={handleClick}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
                                >
                                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">Click to Upload</p>
                                    <p className="text-xs text-gray-500">(Max file size: 25 MB)</p>
                                </div>
                            </div>

                            {/* Type of Care */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Care</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Type to search"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Scheduled Visit Time */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Visit Time</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        value={formData.scheduledDate}
                                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 appearance-none"
                                    >
                                        <option value="12.05.1992">12.05.1992</option>
                                    </select>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 appearance-none"
                                    >
                                        <option value="30mins">30mins</option>
                                        <option value="1hour">1 hour</option>
                                        <option value="2hours">2 hours</option>
                                    </select>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Gender */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
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
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        value={formData.dateOfBirth}
                                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 appearance-none"
                                    >
                                        <option value="12.05.1992">12.05.1992</option>
                                    </select>
                                </div>
                            </div>

                            {/* Client Notes */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client Notes</label>
                                <textarea
                                    value={formData.clientNotes}
                                    onChange={(e) => handleInputChange('clientNotes', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Right Column - Contact & Address */}
                        <div>
                            {/* Contact Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                                        <input
                                            type="email"
                                            value={formData.emailId}
                                            onChange={(e) => handleInputChange('emailId', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone No.</label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNo}
                                            onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Family Member/Carer Name</label>
                                        <input
                                            type="text"
                                            value={formData.familyMember}
                                            onChange={(e) => handleInputChange('familyMember', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number & Relation</label>
                                        <input
                                            type="tel"
                                            value={formData.contactNumber}
                                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                                        <input
                                            type="text"
                                            value={formData.street}
                                            onChange={(e) => handleInputChange('street', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
                                        <input
                                            type="text"
                                            value={formData.suburb}
                                            onChange={(e) => handleInputChange('suburb', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            value={formData.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                                        <input
                                            type="text"
                                            value={formData.postcode}
                                            onChange={(e) => handleInputChange('postcode', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* NDIS Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">NDIS</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">NDIS Number</label>
                                    <input
                                        type="text"
                                        value={formData.ndisNumber}
                                        onChange={(e) => handleInputChange('ndisNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'medical' && (
                // <div className="space-y-6">
                //     <div className="text-center py-8">
                //         <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                //         <p className="text-gray-600">Medical information form will be displayed here</p>
                //     </div>
                // </div>
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Medical Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Medical info</h3>

                            {/* Diagnoses */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnoses</label>
                                <input
                                    type="text"
                                    value={formData.diagnoses}
                                    onChange={(e) => handleInputChange('diagnoses', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Allergies */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                                <input
                                    type="text"
                                    value={formData.allergies}
                                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Medications with Dosage & Timing */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medications with Dosage & Timing
                                    <Plus className="inline ml-2 w-4 h-4 text-gray-400 cursor-pointer" />
                                </label>
                                <input
                                    type="text"
                                    value={formData.medications}
                                    onChange={(e) => handleInputChange('medications', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 mb-2"
                                />
                                {/* Medication Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {medicationTags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {tag}
                                            <button
                                                onClick={() => removeMedicationTag(index)}
                                                className="ml-2 text-purple-600 hover:text-purple-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Mobility Notes */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobility Notes</label>
                                <input
                                    type="text"
                                    value={formData.mobilityNotes}
                                    onChange={(e) => handleInputChange('mobilityNotes', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Emergency Plan */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Plan</label>
                                <input
                                    type="text"
                                    value={formData.emergencyPlan}
                                    onChange={(e) => handleInputChange('emergencyPlan', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Carer Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Carer</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Carer</label>
                                <select
                                    value={formData.carer}
                                    onChange={(e) => handleInputChange('carer', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Erman Watson">Erman Watson</option>
                                    <option value="John Smith">John Smith</option>
                                    <option value="Michael Johnson">Michael Johnson</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact, Documents, Repeat */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* Contact Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number & Relation</label>
                                        <input
                                            type="tel"
                                            value={formData.contactNumber}
                                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Family Member/Carer Name</label>
                                        <input
                                            type="text"
                                            value={formData.familyMember}
                                            onChange={(e) => handleInputChange('familyMember', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Document</label>
                                    {/* Document Tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {documents.map((file, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                📄 {file.name}
                                                <button
                                                    onClick={() => handleRemove(file.name)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <button className="px-4 py-2 bg-[#F2C7AC] text-primary rounded-full  hover:bg-[#ecb08a] transition-colors text-sm"
                                        onClick={handleAddClick}
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

                            {/* Repeat Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Repeat</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
                                    <select
                                        value={formData.repeat}
                                        onChange={(e) => handleInputChange('repeat', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly on the day</option>
                                        <option value="monthly">Monthly on the day</option>
                                        <option value="weekday">Every weekday(Monday to Friday)</option>
                                        <option value="once">Does not repeat</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className=" px-5 py-2 bg-primary text-white rounded-lg hover:bg-[#483154] transition-colors" 
                            onClick={handleBooking}
                            >
                                Book Slot
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {/* <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 mt-6">
                <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Book Slot
                    </button>
                </div>
            </div> */}
        </div>
    );
};