import React from 'react';
import {CheckCircle} from "lucide-react";

interface SuccessAlertProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    buttonText?: string
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              title,
                                                              description,
                                                              buttonText = 'OK'
                                                          }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-500"/>
                    <h2 className="text-xl font-semibold">{title}</h2>
                </div>

                <p className="text-gray-600 mb-6">
                    {description}
                </p>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};