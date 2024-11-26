import React from 'react';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {t('errors.noPermissions')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('errors.noPermissionsDescription')}
                    </p>
                    <div className="mt-6 flex flex-col gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium tex-white bg-blue-600 hover:bg-blue-700"
                        >
                            {t('common.back')}
                        </button>
                        <button
                            onClick={() => {
                                navigate('/')
                            }}
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            {t('common.backToHome')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};