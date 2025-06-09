import { useState } from "react";

// Booking Details Content Component
export const BookingDetailsContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState('medical');

    return (
        <div className="p-6">
            {/* Employee Header */}
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                <img
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                    alt="Emily Harrington"
                    className="w-12 h-12 rounded-full"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Emily Harrington</h3>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {['Personal', 'Medical Info', 'Progress Note', 'Track'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.toLowerCase().replace(' ', '')
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Client Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <img
                    src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                    alt="Kriti Saren"
                    className="w-12 h-12 rounded-full"
                />
                <div>
                    <h4 className="font-semibold text-gray-900">Kriti Saren | F, 28</h4>
                    <p className="text-sm text-gray-600">yessieblein@gmail.com</p>
                    <p className="text-sm text-gray-600">Member No. 123947585605</p>
                    <p className="text-sm text-gray-600">0989120487</p>
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'medicalinfo' && (
                <div className="space-y-6">
                    {/* Carer Details */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Carer Details:</h4>
                    </div>

                    {/* Medical Info */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-4">Medical info</h4>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnoses</label>
                                <p className="text-sm text-gray-600">None</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                <p className="text-sm text-gray-600">None</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medications with Dosage & Timing</label>
                                <p className="text-sm text-gray-600">IBM 60 - Morning</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobility Notes</label>
                                <p className="text-sm text-gray-600">None</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Plan</label>
                                <p className="text-sm text-gray-600">Dose 30</p>
                            </div>
                        </div>
                    </div>

                    {/* Assignee */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Assignee</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Carer</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                                <option>Erman Watson</option>
                                <option>John Smith</option>
                                <option>Michael Johnson</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Section */}
            <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Contact</h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number & Relation</label>
                        <input
                            type="text"
                            value="09989891019"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Family Member/Carer Name</label>
                        <input
                            type="text"
                            value="Father"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            readOnly
                        />
                    </div>
                </div>
            </div>

            {/* Documents */}
            <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Documents</h4>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Document</label>
                    <div className="flex space-x-2 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            📄 Scan.png
                            <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            📄 Report.png
                            <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                        </span>
                    </div>
                    <button className="px-4 py-2 bg-orange-200 text-orange-800 rounded-lg hover:bg-orange-300 transition-colors text-sm">
                        Add Document
                    </button>
                </div>
            </div>

            {/* Repeat */}
            <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Repeat</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 mt-6">
                <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};