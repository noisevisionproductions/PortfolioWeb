import React from "react";
import {SuccessAlert} from "./SuccessAlert";
import {useTranslation} from "react-i18next";

interface AuthFormProps {
    onSubmit: (e: React.FormEvent) => Promise<void>;
    error: string;
    validationErrors: Record<string, string>;
    loading: boolean;
    showSuccessAlert: boolean;
    onSuccessAlertClose: () => void;
    children: React.ReactNode;
    successTitle: string;
    successDescription: string;
    submitButtonText: string;
    translateError: (error: string) => string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
                                                      onSubmit,
                                                      error,
                                                      validationErrors,
                                                      loading,
                                                      showSuccessAlert,
                                                      onSuccessAlertClose,
                                                      children,
                                                      successTitle,
                                                      successDescription,
                                                      submitButtonText,
                                                      translateError
                                                  }) => {
    const {t} = useTranslation();
    const shouldShowError = error && Object.keys(validationErrors).length === 0;

    return (
        <>
            <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
                {shouldShowError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                         role="alert"
                         key={error}
                    >
                        {translateError(error)}
                    </div>
                )}

                <div className="space-y-4">
                    {children}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? t('common.loading') : submitButtonText}
                    </button>
                </div>
            </form>

            <SuccessAlert isOpen={showSuccessAlert}
                          onClose={onSuccessAlertClose}
                          title={successTitle}
                          description={successDescription}
            />
        </>
    );
};