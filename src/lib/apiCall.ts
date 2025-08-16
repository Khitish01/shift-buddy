// lib/apiCall.ts
import { AxiosInstance } from "axios";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export const apiCall = async <T>(
    client: AxiosInstance,
    method: Method,
    url: string,
    data?: any,
    config?: any
): Promise<T> => {
    const response = await client({
        method,
        url,
        data,
        ...config,
    });

    return response.data;
};
