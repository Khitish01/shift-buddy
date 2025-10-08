'use client'
import { AdminLoginPage } from "@/components/login/AdminLoginPage";
import { CarerLoginPage } from "@/components/login/CarerLoginPage";

export default function SuperAdminLogin() {
    const handleLogin = () => {
        // Handle superadmin login
    };
    return (
        <AdminLoginPage onLogin={handleLogin} />
    );
}