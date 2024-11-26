import React from "react";
import {useTranslation} from "react-i18next";
import {useBaseAuthContext} from "../../auth/hooks/useBaseAuthContext";
import {Loader2, RotateCw} from "lucide-react";

interface RedirectingPageProps {
    loadingMessage?: string;
    redirectMessage?: string;
    titleMessage?: string
}

export const RedirectingPage: React.FC<RedirectingPageProps> = ({
                                                                    loadingMessage,
                                                                    redirectMessage,
                                                                    titleMessage
                                                                }) => {
    const {t} = useTranslation();
    const {user} = useBaseAuthContext();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
            <div
                className="bg-white p-8 rounded-lg shadow-lg text-center space-y-6 w-full max-w-md border border-gray-100">
                {user ? (
                    <>
                        <div className="flex items-center justify-center">
                            <RotateCw className="w-12 h-12 text-indigo-500 animate-spin"/>
                        </div>
                        <div className="space-y-4">
                            <div className="text-2xl font-semibold text-gray-700">
                                {titleMessage || t('login.alreadyLoggedIn')}
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-gray-500">
                                <p>{redirectMessage || t('common.redirecting')}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto"/>
                        <p className="text-gray-500">
                            {loadingMessage || t('common.loading')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};