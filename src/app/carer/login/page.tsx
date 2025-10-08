'use client'

import { CarerLoginPage } from "@/components/login/CarerLoginPage";
import { useState } from "react";

export default function CarerLogin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };
    return (
        <CarerLoginPage onLogin={handleLogin} />
    );
}