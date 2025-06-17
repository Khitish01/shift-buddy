// lib/apiClient.ts
import axiosInstance from './axiosInstance';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const apiCall = async <T>(
    method: Method,
    url: string,
    data?: any,
    config?: any
): Promise<T> => {
    const response = await axiosInstance({
        method,
        url,
        data,
        ...config,
    });

    return response.data;
};
