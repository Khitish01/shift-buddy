'use client'
import {CarerLoginPage} from "@/components/login/CarerLoginPage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState('admin') // example role
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  return (
    <CarerLoginPage onLogin={handleLogin} />
  );
}
