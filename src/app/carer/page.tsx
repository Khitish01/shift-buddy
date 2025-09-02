'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CarerModule = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/staff/dashboard'); // Redirect to /dashboard
    }, [router]);

    return null; // Optional: you can show a loading spinner here if you want
};

export default CarerModule;