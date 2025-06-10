import { useState } from "react";

export const BookingDetailsContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState("medicalinfo");

    return (
        <div className="p-6">
            {/* Header */}
            {/* <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 mb-6 pb-4">
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
            alt="Emily Harrington"
            className="w-12 h-12 rounded-full"
          />
          <h3 className="text-lg font-semibold text-gray-900">Emily Harrington</h3>
        </div>
        <button className="text-xl font-semibold text-gray-400">&times;</button>
      </div> */}

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 border-b border-gray-300">
                {['Personal', 'Medical Info', 'Progress Note', 'Track'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                        className={`px-4 pb-2 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.toLowerCase().replace(' ', '')
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-purple-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Carer Info */}
            <div className="bg-gradient-to-l to-[#EFDBF4] from-[#E0E9F7] rounded-full p-4 flex items-center justify-between  mb-6">
                <div className="flex-1">
                    <p className="font-bold text-sm">Carer Details:</p>
                </div>
                <div className="flex flex-1 items-center space-x-4">
                    <img
                        src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                        alt="Kriti Saren"
                        className="w-14 h-14 rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-sm text-gray-800">Kriti Saren | F, 28</p>
                        <p className="text-sm text-gray-600">yessieklein@gmail.com</p>
                        <p className="text-sm text-gray-600">Member No. 1239475605</p>
                        <p className="text-sm text-purple-600 font-medium">0898120987</p>
                    </div>
                </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                    <p className="font-bold text-sm">Medical info</p>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Diagnoses</label>
                        <input type="text" value="None" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Allergies</label>
                        <input type="text" value="None" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Medications with Dosage & Timing</label>
                        <input type="text" value="IBM 60 - Morning" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Mobility Notes</label>
                        <input type="text" value="None" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Emergency Plan</label>
                        <input type="text" value="Dose 30" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Assign Carer</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option>Erman Watson</option>
                            <option>John Smith</option>
                            <option>Michael Johnson</option>
                        </select>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <p className="font-bold text-sm">Contact</p>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Contact Number & Relation</label>
                        <input type="text" value="0989891019" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Family Member/Carer Name</label>
                        <input type="text" value="Father" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Document</label>
                        <div className="flex space-x-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                Scan.png <button className="ml-2">&times;</button>
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                Report.png <button className="ml-2">&times;</button>
                            </span>
                        </div>
                        <button className="mt-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200">
                            Add Document
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Repeat</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 mt-6">
                <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        Save Changes
                    </button>
                </div>
                </div> */}
        </div >
    );
};
