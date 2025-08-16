// lib/axios/createAxios.ts
import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const createAxios = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        timeout: 10000,
        withCredentials: true,
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            const token = Cookies.get("accessToken");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }

            if (
                !config.headers["Content-Type"] &&
                !(config.data instanceof FormData)
            ) {
                config.headers["Content-Type"] = "application/json";
            }

            config.headers["x-client-type"] = "web";
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (typeof window !== "undefined" && error.response?.status === 401) {
                window.location.href = "/sessionout";
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default createAxios;
