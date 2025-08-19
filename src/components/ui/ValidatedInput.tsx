'use client';
import { z, ZodError } from "zod";
import { useState } from "react";

interface ValidatedInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (val: string) => void;
    schema: z.ZodTypeAny;   // single field schema
    path: string;
    placeholder?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
    label,
    type = "text",
    value,
    onChange,
    schema,
    placeholder
}) => {
    const [error, setError] = useState<string>("");

    const validateField = (val: string) => {
        try {
            schema.parse(val);
            setError("");
        } catch (err) {
            if (err instanceof ZodError && err.issues.length > 0) {
                setError(err.issues[0].message);   // ✅ use issues
            } else {
                setError("Invalid");
            }
        }
    };

    const handleChange = (val: string) => {
        onChange(val);
        validateField(val);    // validate live
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => handleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none appearance-none bg-white
          ${error ? "border-red-500" : "border-gray-300 focus:border-purple-500"}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
