// lib/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    timeout: 10000,
    withCredentials: true, // ✅ Send and receive cookies
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('accessToken'); // reads token from cookies (client-side only)
        console.log(accessToken);
        
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        config.headers['Content-Type'] = 'application/json';
        config.headers['x-client-type'] = 'web';
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Unauthorized – maybe redirect to login.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
