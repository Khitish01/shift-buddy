'use client'

import { useEffect, useState } from "react";
import { ValidatedInput } from "../ui/ValidatedInput";
import { fieldSchemas } from "@/lib/validationSchemas";
import { apiCall } from "@/lib/apiCall";
import { adminClient } from "@/lib/apiClient";
import { useTopLoader } from "@/context/TopLoader";

export default function AddShiftModal({ show, onSuccess, onClose }: { show: boolean; onSuccess: () => void; onClose: () => void }) {
    if (!show) return null
    const loader = useTopLoader();
    const [formData, setFormData] = useState({
        shiftName: '',
        timing: '',
        startTime: '',
        endTime: '',
    });

    const createShift = async () => {
        loader.showLoader()
        try {
            const result = await apiCall<any>(adminClient, 'POST', '/shift/v1/create_shift', formData)
            console.log(result);
            loader.hideLoader()
            onSuccess()
        }
        catch (error) {
            console.log(error)
            loader.hideLoader()
        }
    }
    return (

        <>
            <div
                className="fixed inset-0 h-screen w-screen bg-black z-[110] opacity-70 transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-[111] flex items-center justify-center pointer-events-none">
                <div className="bg-white p-6 rounded-xl shadow-lg w-[350px] pointer-events-auto animate-scaleIn">

                    <div className="flex mb-6">
                        <h2 className="text-lg font-semibold text-center w-[90%]">Add New Shift</h2>
                        <button onClick={onClose} className="text-gray-500 rounded-full bg-[#F7F7F7] w-[10%] text-xl">&times;</button>
                    </div>

                    <div className="mb-4">
                        {/* <label className="block text-sm font-medium text-gray-700 mb-2">Name of the shift</label> */}
                        {/* <input
                            type="text"
                            // value={formData.relationInfo.relativeRelation}
                            // onChange={(e) =>
                            //     handleInputChange('relationInfo', {
                            //         ...formData.relationInfo,
                            //         relativeRelation: e.target.value
                            //     })
                            // }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        /> */}

                        <ValidatedInput
                            label="Name of the shift"
                            value={formData.shiftName}
                            placeholder="Enter name"
                            onChange={(val) =>
                                setFormData({ ...formData, shiftName: val })
                            }
                            schema={fieldSchemas["shiftName"]}
                            path="shiftName"
                        />
                    </div>
                    <div className="mb-4">
                        {/* <label className="block text-sm font-medium text-gray-700 mb-2">Shift Timing</label> */}
                        {/* <input
                            type="text"
                            // value={formData.relationInfo.relativeRelation}
                            // onChange={(e) =>
                            //     handleInputChange('relationInfo', {
                            //         ...formData.relationInfo,
                            //         relativeRelation: e.target.value
                            //     })


                            // }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        /> */}

                        <ValidatedInput
                            label="Shift Timing"
                            value={formData.timing}
                            title="Enter shift timing in start-end format, e.g., 09-18"
                            placeholder="start-end (HH-HH)"
                            onChange={(val) => {
                                const [start, end] = val.split("-");
                                setFormData({ ...formData, timing: val, startTime: start, endTime: end })
                            }
                            }
                            schema={fieldSchemas["shiftName"]}
                            path="shiftName"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button className="px-5 bg-[#69417E] text-white py-2 rounded-xl hover:bg-[#452469]"
                            onClick={createShift}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}
