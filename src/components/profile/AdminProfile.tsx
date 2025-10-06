'use client'

import { LogoutIcon } from "@/app/images";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiCall";
import { adminClient } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

const AdminProfile = () => {
    const loader = useTopLoader();
    const router = useRouter();
    const [profileDetails, setProfileDetails] = useState<any>();
    const getProfile = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'GET', 'admin/v1/get_profile')
            console.log(res);
            setProfileDetails(res?.data);
        } catch (err: any) {
            console.log(err);
        } finally {
            loader.hideLoader()
        }

    }
    useEffect(() => {
        getProfile()
    }, [])
    const logout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('role');
        // sessionStorage.clear()
        router.push('/admin-login');
    }

    return (
        <div className="p-6 pt-3 space-y-6">
            <div className="">
                <img src="/images/profile-header.jpg" alt="" className="w-full h-14 rounded-t-2xl" />
            </div>
            <div className="flex justify-between w-full items-center">
                <div className="flex items-center gap-4">
                    {/* <div className=" "> */}

                    <img src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face" alt="" className="w-20 h-20 rounded-full" />
                    {/* </div> */}
                    <div>
                        <p className="text-lg font-semibold">{profileDetails?.name}</p>
                        <p className="text-sm text-gray-500 font-semibold">{profileDetails?.email}</p>
                        <a href="javaScript:Void(0);" className="text-primary font-semibold text-xs">Change Password</a>
                    </div>
                </div>
                <div>
                    <button className="text-primary text-lg cursor-pointer" onClick={logout}>
                        <LogoutIcon />
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                <div className="">
                    <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text"
                        value={profileDetails?.name}
                        className="border-gray-300 focus:border-purple-500 w-full px-3 py-2 border rounded-lg focus:outline-none" />
                </div>
                <div className="">
                    <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select name="" id="" className="border-gray-300 focus:border-purple-500 w-full px-3 py-2 border rounded-lg focus:outline-none">
                        <option value="">Select</option>
                    </select>
                </div>
                <div className="">
                    <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">DOB</label>
                    <input type="text" className="border-gray-300 focus:border-purple-500 w-full px-3 py-2 border rounded-lg focus:outline-none" />
                </div>
                <div className="">
                    <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">Shift Timing</label>
                    <select name="" id="" className="border-gray-300 focus:border-purple-500 w-full px-3 py-2 border rounded-lg focus:outline-none">
                        <option value="">Select</option>
                    </select>
                </div>
                <div className="">
                    <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">Employement Type</label>
                    <select name="" id="" className="border-gray-300 focus:border-purple-500 w-full px-3 py-2 border rounded-lg focus:outline-none">
                        <option value="">Select</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default AdminProfile;