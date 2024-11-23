import React from 'react';
import {Eye, EyeOff} from "lucide-react";

interface FormInputProps {
    id: string;
    type?: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
    translateError?: (key: string) => string;
}

export const FormInput: React.FC<FormInputProps> = ({
                                                        id,
                                                        type = "text",
                                                        label,
                                                        value,
                                                        onChange,
                                                        required = false,
                                                        error,
                                                        translateError
                                                    }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    required={required}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pl-3 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                )}
            </div>
            {error && translateError && (
                <p className="mt-1 text-sm text-red-600">
                    {translateError(error)}
                </p>
            )}
        </div>
    );
};