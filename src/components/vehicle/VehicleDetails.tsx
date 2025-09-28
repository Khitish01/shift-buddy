'use client'

import { apiCall } from "@/lib/apiCall"
import { adminClient } from "@/lib/apiClient"
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface CarerProps {
    selectedVehicle: any;
}
export const VehicleDetails: React.FC<CarerProps> = ({ selectedVehicle }) => {
    const [vehicleHistory, setVehicleHistory] = useState<any[]>([])
    const vehicleDetails = async () => {
        let payload = {
            vehicleId: selectedVehicle?._id,
            sortBy: "createdAt",
            sortOrder: "desc",
            page: 1,
            limit: 15
        }
        const res = await apiCall<any>(adminClient, 'POST', 'vehicle/v1/getVehicleHistory', payload)
        console.log(res);
        setVehicleHistory(res.data)
    }
    useEffect(() => {
        vehicleDetails()
    }, [])
    return <>
        <div className="p-4 px-6 space-y-4">
            <div className="space-y-4">
                <p>Vehicle Img</p>
                <img src={selectedVehicle?.vehicleImage} alt="Vehicle Image" className="h-36 w-36 object-contain" />
            </div>
            <div className="space-y-4">
                <p>Vehicle Details</p>
                <div className="space-y-0.5 text-[#767575] bg-[#81B29C1A] p-4 rounded w-fit">
                    <p className="font-bold text-black">{selectedVehicle?.modelName}</p>
                    <p className="font-semibold">Registration No: {selectedVehicle?.registrationNo}</p>
                    <p className="font-semibold">Model: {selectedVehicle?.modelNumber}</p>
                </div>
            </div>
            {vehicleHistory.length > 0 && <div className="space-y-4">
                <p className="font-semibold">Assign History</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {vehicleHistory.map((history, index) => (
                        <div key={index} className="bg-[#F2C7AC36] rounded-lg p-4 shadow-sm flex justify-between">
                            <div className="">
                                <div className="text-sm text-gray-500 mb-1">{dayjs(history.createdAt).format('DD/MM/YYYY')}</div>
                                <div className="font-medium text-gray-900 mb-1">Booking Id: #{history.bookingId?.bookingId}</div>
                                <div className="text-sm text-gray-600 mb-1">Assign - {history.carrierId?.name}</div>
                            </div>
                            {/* <div className="text-right text-sm text-gray-500">5.7km</div> */}
                            {/* <div className="text-sm text-gray-500">{history.carrierId?.mobileNumber}</div> */}
                        </div>
                    ))}
                </div>
            </div>}

        </div>
    </>
}