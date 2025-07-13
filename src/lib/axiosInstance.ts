// lib/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    timeout: 10000,
    withCredentials: true, // ✅ Send and receive cookies
});

axiosInstance.interceptors.request.use(
    (config) => {
        let accessToken = '';

        if (typeof window !== 'undefined') {
            // const fromSession = sessionStorage.getItem('accessToken') || '';
            // console.log(fromSession);

            const fromCookies = Cookies.get('accessToken');
            console.log(fromCookies);
            // accessToken = fromCookies || fromSession ? JSON.parse(fromSession) : '';
            accessToken = fromCookies || ''
        }

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Only set Content-Type if not already set and data isn't FormData
        if (
            !config.headers['Content-Type'] &&
            !(config.data instanceof FormData)
        ) {
            config.headers['Content-Type'] = 'application/json';
        }
        config.headers['x-client-type'] = 'web';
        // config.headers['Host'] = 'shift-buddy-admin-service-main.onrender.com';
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined' && error.response?.status === 401) {
            console.warn('Unauthorized – maybe redirect to login.');
            // Router.push('/unauthorized');
            window.location.href = '/sessionout';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
