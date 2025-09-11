'use client'

import { useEffect, useState } from "react";
import { DateInput } from "../common/date-input";
import { usePopup } from "@/context/PopupContext";
import { apiCall } from "@/lib/apiCall";
import { adminClient } from "@/lib/apiClient";
import { useTopLoader } from "@/context/TopLoader";
import { AutocompleteInput } from "../ui/AutoCompleteInput";
import { fieldSchemas } from "@/lib/validationSchemas";
import dayjs from "dayjs";
import { ValidatedSelect } from "../ui/ValidatedSelect";

export default function AddCarerModal({ show, onSuccess, onClose }: { show: boolean; onSuccess: () => void; onClose: () => void }) {
    if (!show) return null
    const [range, setRange] = useState<string[]>([])
    const [carerName, setCarerName] = useState<string>('')
    const [shiftTabs, setShiftTabs] = useState<any[]>([]);
    const loader = useTopLoader();
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        carrierId: "",
        shiftId: ""
    });
    const [carersList, setCarersList] = useState<any>([]);
    // const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState(carerName);

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


    const addCarerShift = async () => {
        loader.showLoader()
        try {
            const result = await apiCall<any>(adminClient, 'POST', '/shift/v1/create_carrier_shift', formData)
            console.log(result);
            loader.hideLoader()
            onSuccess()
        } catch (error) {
            console.error('Error setting role:', error)
            loader.hideLoader()
        }
    }




    const getShiftList = async () => {
        const result = await apiCall<any>(adminClient, 'GET', '/shift/v1/get_shift')
        console.log(result);
        setShiftTabs(result?.data)

    }
    useEffect(() => {
        getShiftList()
    }, [])

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
                        {/* <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
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
                        /> */}

                        <AutocompleteInput
                            label="Name"
                            value={carerName}
                            onChange={(value, selectedCarer) => {
                                setCarerName(value)
                                if (selectedCarer) {
                                    setFormData(prev => ({ ...prev, carrierId: selectedCarer._id }))
                                } else {
                                    setFormData(prev => ({ ...prev, carrierId: '' }))

                                }
                            }}
                            schema={fieldSchemas["carerName"]}
                            placeholder="Type carer name"
                            carers={carersList}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Carer Id</label>
                        <input
                            type="text"
                            value={formData.carrierId}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                    </div>
                    <div className="mb-4">
                        <ValidatedSelect
                            label="Repeat"
                            value={formData.shiftId}
                            onChange={(val) =>
                                setFormData(prev => ({ ...prev, shiftId: val }))
                            }
                            schema={fieldSchemas["shiftId"]}
                            path="shiftId"
                            options={[
                                { label: "Select shift", value: "" }, // Default empty option
                                ...shiftTabs.map((mode: any) => ({
                                    label: `${mode.shiftName} (${mode.startTime}-${mode.endTime})`,
                                    value: mode?._id,
                                }))
                            ]}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date range</label>
                        <DateInput
                            value={range}
                            onChange={(val) => {
                                setRange(val as string[])
                                setFormData(prev => ({ ...prev, startDate: val?.[0], endDate: val?.[val?.length - 1] }))
                            }
                            }
                            // calendarMode={'dropdown'}
                            selectionMode={'range'}
                            dateFormat="yyyy-mm-dd"
                            placeholder="Choose a date range"
                            minDate={dayjs().format('YYYY-MM-DD')}
                            maxDate={dayjs().add(3, 'M').format('YYYY-MM-DD')}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button className="px-5 bg-[#69417E] text-white py-2 rounded-xl hover:bg-[#452469]"
                            onClick={addCarerShift}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
