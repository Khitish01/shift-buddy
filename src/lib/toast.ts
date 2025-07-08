// lib/toast.ts
import { toast } from 'react-hot-toast';

export const showErrorToast = (message: string) => {
    toast.error(message, {
        style: {
            border: '1px solid #69417E',
            padding: '12px 16px',
            color: '#fff',
            background: '#69417E',
            borderRadius: '20px',
            fontSize: '14px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#69417E',
        },
    });
};
export const showSucessToast = (message: string) => {
    toast.success(message, {
        style: {
            border: '1px solid #69417E',
            padding: '12px 16px',
            color: '#fff',
            background: '#69417E',
            borderRadius: '20px',
            fontSize: '14px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#69417E',
        },
    });
};
