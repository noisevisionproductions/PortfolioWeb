import React from 'react';
import {useBaseAuthContext} from "../../hooks/useBaseAuthContext";
import {useAuthForm} from "../../hooks/useAuthForm";
import {AuthPage} from "../AuthPage";
import {AuthForm} from "../AuthForm";
import {FormInput} from "../../../components/shared/FormInput";
import {LanguageSelector} from './ProgrammingLanguageSelector';
import programmingLanguages from '../../../assets/programmingLanguages.json';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {RegisterRequest} from "../../types/auth";
import {useLanguageSwitch} from "../../../utils/translations/LanguageContext";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate()
    const {t} = useTranslation();
    const {currentLanguage} = useLanguageSwitch();
    const {register} = useBaseAuthContext();
    const {
        formData,
        error,
        validationErrors,
        loading,
        showSuccessAlert,
        handleSubmit,
        handleInputChange,
        handleSuccessAlertClose
    } = useAuthForm<RegisterRequest>({
        onSubmit: register,
        initialData: {
            email: '',
            password: '',
            name: '',
            companyName: '',
            programmingLanguages: []
        },
        onSuccess: () => navigate('/')
    });

    const allLanguages = [
        ...programmingLanguages.languages,
        programmingLanguages.other[currentLanguage]
    ];

    return (
        <AuthPage
            title={t('header.title')}
            navigation={{login: t('header.navigation.login')}}
        >
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {t('register.title')}
            </h2>

            <AuthForm
                onSubmit={handleSubmit}
                error={error}
                validationErrors={validationErrors}
                loading={loading}
                showSuccessAlert={showSuccessAlert}
                onSuccessAlertClose={handleSuccessAlertClose}
                successTitle={t('register.success.title')}
                successDescription={t('register.success.description')}
                submitButtonText={t('register.submit')}
                translateError={(error) => t(`register.errors.${error}`)}
            >
                <FormInput
                    id="name"
                    label={t('register.name')}
                    value={formData.name || ''}
                    onChange={handleInputChange('name')}
                />

                <FormInput
                    id="companyName"
                    label={t('register.companyName')}
                    value={formData.companyName || ''}
                    onChange={handleInputChange('companyName')}
                />

                <FormInput
                    id="email"
                    type="email"
                    label={t('register.email')}
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    error={validationErrors.email}
                    translateError={(key) => t(`register.errors.${key}`)}
                />

                <FormInput
                    id="password"
                    type="password"
                    label={t('register.password')}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    error={validationErrors.password}
                    translateError={(key) => t(`register.errors.${key}`)}
                />

                <LanguageSelector
                    label={t('register.programmingLanguages')}
                    options={allLanguages}
                    selected={formData.programmingLanguages || []}
                    onChange={(selected) => handleInputChange('programmingLanguages')(selected)}
                />
            </AuthForm>
        </AuthPage>
    );
};