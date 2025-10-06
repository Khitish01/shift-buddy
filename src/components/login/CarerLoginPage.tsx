'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTopLoader } from '@/context/TopLoader';
import { apiCall } from '@/lib/apiCall';
import { showErrorToast, showSucessToast } from '@/lib/toast';
import { usePopup } from '@/context/PopupContext';
import Cookies from 'js-cookie'
import { useChatSocket } from '@/context/ChatSocketContext';
import { adminClient, carerClient } from '@/lib/apiClient';

interface LoginPageProps {
    onLogin: () => void;
}

export const CarerLoginPage = ({ onLogin }: LoginPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin') // example role
    const router = useRouter()
    const loader = useTopLoader()
    const { showPopup, updatePopupStatus } = usePopup();
    // const { fetchConversations } = useChatSocket(); // ✅ use context
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log('logged in....');
        loader.showLoader()
        // showPopup('PENDING', "Login Initiated");
        try {
            // router.push('/admin')
            const payload = {
                email,
                password
            }
            const res = await apiCall<any>(carerClient, 'POST', '/carrier/v1/carrier-login', payload)
            // sessionStorage.setItem('accessToken', JSON.stringify(res.accessToken))
            // Cookies.set('accessToken', res.accessToken, { path: '/', secure: true, sameSite: 'Lax' })
            const role = res?.carrer?.role == "carrier" ? 'carer' : 'superadmin'
            console.log(role);
            
            Cookies.set('accessToken', res.accessToken, {
                expires: 0.0416, // ~30 minutes (1 day = 1)
                path: '/',
                secure: true,
                sameSite: 'Lax',
            });
            Cookies.set('role', role, {
                expires: 0.0416, // ~30 minutes (1 day = 1)
                path: '/',
                secure: true,
                sameSite: 'Lax',
            });
            console.log(res);
            // fetchConversations();
            // showSucessToast('Login Successfull')
            // showPopup('Booking Processed', "Your booking has been initiated"); // Optional message & duration

            // setTimeout(() => {
            // updatePopupStatus('success', 'SUCCESS', "Login Successfull", 4000); // Optional message & duration
            // showPopup('SUCCESS', "Login Successfull");
            // }, 1000)


            router.push(role)
        } catch (error: any) {
            console.error('API error:', error.response?.data || error.message);
            showErrorToast(error?.response?.data?.msg || 'Something went wrong');
        } finally {
            loader.hideLoader()
        }


    };

    return (
        <div className="min-h-screen flex relative">
            {/* Left side - Background image */}
            <div
                className="flex-1 bg-cover bg-center relative bg-no-repeat"
                style={{
                    backgroundImage: `url('/images/carer-login-bg.jpg')`
                }}
            >
                {/* <div className="absolute inset-0 bg-black/20"></div> */}

                {/* Logo */}
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <img src="logos/Shift Buddy Logo.svg" alt="" />
                </div>
            </div>

            {/* Right side - Login form */}
            <div className=" bg-white flex items-center justify-center p-10 absolute top-11 md:top-0 right-[-25px] md:right-0 w-[80%] md:w-[35%] h-[70%] md:h-[80%] rounded-3xl" style={{ transform: 'translate(-20%, 15%)' }}>
                <div className="w-full h-full relative">
                    <div className="mb-8">
                        <p className="text-black mb-2 text-xs md:text-lg">Welcome to <span className="text-primary font-semibold">ShiftBuddy</span></p>
                        <h1 className="text-xl md:text-4xl font-semibold text-gray-900">Sign up</h1>
                        <p className='mt-2 text-[#5B5B5B] text-[14px]'>Empowering Providers. Simplifying Care. Compliance with ease. Log in to get started.</p>
                        <div className='h-2 bg-[#F8EDDD] w-[60%] md:w-[50%] mt-3'>

                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className=" font-medium mb-3">
                                Enter your username or email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Username or email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 h-12 border border-[#ADADAD] focus:border-[#4285F4] rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className=" font-medium mb-3">
                                Enter your Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 h-12 border border-[#ADADAD] focus:border-[#4285F4] rounded-lg"
                                required
                            />
                            <div className="text-right mt-2">
                                <a href="#" className="text-[#4285F4] text-sm hover:underline">
                                    Forgot Password
                                </a>
                            </div>
                        </div>

                        <div className='absolute right-0 bottom-0'>
                            <Button
                                type="submit"
                                className=" w-40 md:w-60 h-12 bg-primary hover:bg-[#715581] text-white font-medium rounded-lg mt-8 cursor-pointer"
                                style={{ boxShadow: '0px 4px 19px 0px #7793414D' }}
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}