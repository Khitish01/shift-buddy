'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminModule = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard'); // Redirect to /dashboard
    }, [router]);

    return null; // Optional: you can show a loading spinner here if you want
};

export default AdminModule;
