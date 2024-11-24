import React from 'react';

interface ErrorMessageProps {
    error: string | null;
    onBack: () => void;
    t: (key: string) => string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({error, onBack, t}) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('projectDetails.error')}
                </h2>
                <p className="text-gray-600">
                    {error}
                </p>
                <button
                    onClick={onBack}
                    className="mt-4 text-blue-500 hover:text-blue-700"
                >
                    {t('projectDetails.backToMainMenu')}
                </button>
            </div>
        </div>
    );
};