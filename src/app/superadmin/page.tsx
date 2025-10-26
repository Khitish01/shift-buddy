'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SuperAdminModule = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/superadmin/login'); // Redirect to carer dashboard
    }, [router]);

    // return (
    //     <div className="flex items-center justify-center min-h-screen bg-gray-50">
    //         <div className="text-center">
    //             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    //             <p className="text-gray-600">Loading...</p>
    //         </div>
    //     </div>
    // );
    return null; // Optional: you can show a loading spinner here if you want
};

export default SuperAdminModule;