'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { login } from './apicalls/auth';

interface LoginPageProps {
    onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin') // example role
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('logged in....');

        try {
            // const response = await login(role)
            const response = await fetch('/api/set-role-cookie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role }),
            })

            const result = await response.json()
            if (result.success) {
                alert('Role cookie set successfully')
                router.push(`/${role}`)
                onLogin();
                // optionally redirect user or update state
            } else {
                alert('Failed to set cookie')
            }
        } catch (error) {
            console.error('Error setting role:', error)
        }


    };

    return (
        <div className="min-h-screen flex relative">
            {/* Left side - Background image */}
            <div
                className="flex-1 bg-cover bg-center relative bg-no-repeat"
                style={{
                    backgroundImage: `url('/images/login-bg.jpg')`
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
                <div className="w-full h-full">
                    <div className="mb-12 pb-6 border-b-8 border-[#F8EDDD] w-[60%] md:w-[50%]">
                        <p className="text-black mb-2 text-xs md:text-lg">Welcome to <span className="text-[#69417E] font-semibold">ShiftBuddy</span></p>
                        <h1 className="text-xl md:text-4xl font-bold text-gray-900">Sign up</h1>
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

                        <div className='flex justify-end mt-14'>
                            <Button
                                type="submit"
                                className=" w-40 md:w-60 h-12 bg-[#69417E] hover:bg-[#715581] text-white font-medium rounded-lg mt-8 cursor-pointer"
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