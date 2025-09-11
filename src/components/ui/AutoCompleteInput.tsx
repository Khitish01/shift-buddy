'use client';

import { z, ZodError } from "zod";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface Carer {
    id: string;
    name: string;
}

interface AutocompleteInputProps {
    label: string;
    value: string;
    onChange: (val: string, selectedCarer?: any) => void;
    schema: z.ZodTypeAny;
    placeholder?: string;
    carers: any[];
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    label,
    value,
    onChange,
    schema,
    placeholder,
    carers,   // Array of any objects with at least a `name` property
}) => {
    const [error, setError] = useState<string>("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (inputValue.trim().length > 0) {
            const filtered = carers.filter((carer) =>
                carer.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions(carers);
        }
    }, [carers, inputValue]);

    const validateField = (val: string) => {
        try {
            schema.parse(val);
            setError("");
        } catch (err) {
            if (err instanceof ZodError && err.issues.length > 0) {
                setError(err.issues[0].message);
            } else {
                setError("Invalid");
            }
        }
    };

    const handleChange = (val: string) => {
        setInputValue(val);
        validateField(val);
        onChange(val);

        if (val.trim().length > 0) {
            const filtered = carers.filter((carer) =>
                carer.name.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered);
            setShowDropdown(true);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    const handleFocus = () => {
        if (carers.length > 0) {
            setSuggestions(carers);
            setShowDropdown(true);
        }
    };

    const handleSelect = (carer: any) => {
        setInputValue(carer.name);
        validateField(carer.name);
        onChange(carer.name, carer);
        setShowDropdown(false);
    };

    return (
        <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type="text"
                value={inputValue}
                placeholder={placeholder}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none appearance-none bg-white
          ${error ? "border-red-500" : "border-gray-300 focus:border-purple-500"}`}
            />

            <button className="absolute right-3 top-10 text-gray-500">
                <Search size={18}/>
            </button>

            {showDropdown && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow">
                    {suggestions.map((carer, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(carer)}
                            className="cursor-pointer px-4 py-2 hover:bg-purple-100"
                        >
                            {carer.name}
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
