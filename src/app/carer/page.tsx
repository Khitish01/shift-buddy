'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CarerModule = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/carer/dashboard'); // Redirect to carer dashboard
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default CarerModule;