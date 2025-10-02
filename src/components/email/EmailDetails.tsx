export const EmailDetails = () => {
    // if (!email) return <div className="p-4">No email selected.</div>;
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                        G
                    </div>
                    <div>
                        <div className="font-semibold">Gray</div>
                        <div className="text-sm text-gray-500">Graysonpoul458@gmail.com</div>
                    </div>
                </div>
                <div className="text-sm text-gray-500">May 6, 2024 - 11:30 AM</div>
            </div>

            <h1 className="text-2xl font-bold mb-6">Blood sample is collected.</h1>

            <div className="space-y-4 text-sm">
                <p>Hello Admin,</p>
                <p>This is to inform you that a blood sample has been successfully collected.</p>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">📋 Patient Details:</h3>
                    <ul className="space-y-1 text-sm">
                        <li>• Patient Name: Jean Sharma</li>
                        <li>• Patient ID: PT20345</li>
                        <li>• Age: 28</li>
                        <li>• Gender: Female</li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">🩸 Collected By:</h3>
                    <ul className="space-y-1 text-sm">
                        <li>• Phlebotomist Name: Ramesh Kumar</li>
                        <li>• Staff ID: APH623</li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">⏰ Collection Time:</h3>
                    <ul className="space-y-1 text-sm">
                        <li>• Date: 7 August, 2025</li>
                        <li>• Time: 10:30 AM</li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">📍 Collection Location:</h3>
                    <p className="text-sm">• Address: 32, Ganga Road, Dehradun, Uttarakhand</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">🔗 Track Sample Status: [View in Dashboard]</h3>
                </div>

                <div>
                    <p className="font-semibold">Regards,</p>
                    <p>Apollo Diagnostics System</p>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Attachment</h3>
                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded w-fit">
                        <span className="text-red-600">📄</span>
                        <div>
                            <div className="text-sm font-medium">Report Receipt</div>
                            <div className="text-xs text-gray-500">View • Download</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t pt-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                        G
                    </div>
                    <span className="text-blue-600">Graysonpoul458@gmail.com</span>
                    <button className="ml-auto text-gray-400">🗑</button>
                </div>

                <div className="bg-gray-50 p-4 rounded mb-4">
                    <p className="text-sm mb-2">Thank you for the update.</p>
                    <p className="text-sm mb-2">The blood sample collection for patient Jean Sharma (PT20345) has been noted. We will monitor the progress and ensure timely processing of the tests requested (CBC, Thyroid Profile).</p>
                    <p className="text-sm">Please keep us informed of any delays or discrepancies.</p>
                </div>

                <div className="flex items-center justify-between">
                    <button className="text-gray-400">📎</button>
                    <button className="bg-[#69417E] text-white px-6 py-2 rounded">Send</button>
                </div>
            </div>
        </div>
    )
}