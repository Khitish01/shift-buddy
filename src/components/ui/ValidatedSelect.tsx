'use client';
import { z, ZodError } from "zod";
import { useState, ReactNode } from "react";

interface Option {
  label: string;
  value: string;
}

interface ValidatedSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  schema: z.ZodTypeAny;
  path: string;
  options: Option[];
  placeholder?: string;
  icon?: ReactNode;   // ✅ optional icon prop
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  label,
  value,
  onChange,
  schema,
  path,
  options,
  placeholder,
  icon
}) => {
  const [error, setError] = useState<string>("");

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
    onChange(val);
    validateField(val);
  };

  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {icon && (
        <span className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full ${icon ? "pl-10" : "px-3"} pr-3 py-2 border rounded-lg focus:outline-none 
          ${error ? "border-red-500" : "border-gray-300 focus:border-purple-500"}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
