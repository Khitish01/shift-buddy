'use client'

import { useState } from "react";
import { DateInput } from "../common/date-input";
import { usePopup } from "@/context/PopupContext";

export default function AddCarerModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    if (!show) return null
    const [range, setRange] = useState<string[]>([])
    // const { showPopup, updatePopupStatus } = usePopup();

    // const addCarerShift = async () => {

    //     showPopup('Processing', "Carer new shift is processing.."); // Optional message & duration
    //     try {

    //     } catch (error) {
    //         console.error('Error setting role:', error)
    //     } finally {
    //         // loader.hideLoader()
    //         updatePopupStatus('success', 'Carer added to the shift', "Congratulation, Carer has been added to the shift.", 4000); // Optional message & duration
    //     }
    // }

    return (
        <>
            <div
                className="fixed inset-0 h-screen w-screen bg-black z-[110] opacity-70 transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-[111] flex items-center justify-center pointer-events-none">
                <div className="bg-white p-6 rounded-xl shadow-lg w-[350px] pointer-events-auto animate-scaleIn">

                    <div className="flex mb-6">
                        <h2 className="text-lg font-semibold text-center w-[90%]">Add Carer</h2>
                        <button onClick={onClose} className="text-gray-500 rounded-full bg-[#F7F7F7] w-[10%] text-xl">&times;</button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            // value={formData.relationInfo.relativeRelation}
                            // onChange={(e) =>
                            //     handleInputChange('relationInfo', {
                            //         ...formData.relationInfo,
                            //         relativeRelation: e.target.value
                            //     })
                            // }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Carer Id</label>
                        <input
                            type="text"
                            // value={formData.relationInfo.relativeRelation}
                            // onChange={(e) =>
                            //     handleInputChange('relationInfo', {
                            //         ...formData.relationInfo,
                            //         relativeRelation: e.target.value
                            //     })
                            // }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
                        <select
                            value={''}
                            // onChange={(e) => setFormData({ ...formData, repeatId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        >
                            {/* {repeatModes.map((mode: any, index: number) => ( */}
                            <option value={''}>Morning Shift (6am - 4pm)</option>

                            {/* ))} */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date range</label>
                        <DateInput
                            // value={range}
                            // onChange={() => setRange}
                            selectionMode="single"
                            dateFormat="yyyy-mm-dd"
                            placeholder="Choose a date range"
                            minDate="2024-01-01"
                            maxDate="2025-12-31"
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button className="px-5 bg-[#69417E] text-white py-2 rounded-xl hover:bg-[#452469]"
                        onClick={onClose}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
