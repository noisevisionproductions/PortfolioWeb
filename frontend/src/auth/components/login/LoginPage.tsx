import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthContext} from "../../hooks/useAuthContext";
import {useAuthForm} from "../../hooks/useAuthForm";
import {AuthPage} from "../AuthPage";
import {AuthForm} from "../AuthForm";
import {FormInput} from "../../../components/shared/FormInput";
import {useLanguage} from "../../../utils/translations/LanguageContext";

export const LoginPage: React.FC = () => {
    const {t} = useLanguage();
    const navigate = useNavigate();
    const {login} = useAuthContext();
    const {
        formData,
        error,
        validationErrors,
        loading,
        showSuccessAlert,
        handleSubmit,
        handleInputChange,
        handleSuccessAlertClose
    } = useAuthForm({
        onSubmit: async (data) => await login(data.email, data.password),
        initialData: {email: '', password: ''},
        onSuccess: () => navigate('/')
    });

    return (
        <AuthPage
            title={t('header.title')}
            navigation={{login: t('header.navigation.login')}}
        >
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {t('login.title')}
            </h2>

            <AuthForm onSubmit={handleSubmit}
                      error={error}
                      validationErrors={validationErrors}
                      loading={loading}
                      showSuccessAlert={showSuccessAlert}
                      onSuccessAlertClose={handleSuccessAlertClose}
                      successTitle={t('login.success.title')}
                      successDescription={t('login.success.description')}
                      submitButtonText={t('login.submit')}
                      translateError={(error) => t(`login.errors.${error}`)}
            >

                <FormInput
                    id="email"
                    type="email"
                    label={t('login.email')}
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    error={validationErrors.email}
                    translateError={(key) => t(`login.errors.${key}`)}
                />

                <FormInput
                    id="password"
                    type="password"
                    label={t('login.password')}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    error={validationErrors.password}
                    translateError={(key) => t(`login.errors.${key}`)}
                />
            </AuthForm>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        {t('login.register')}
                    </Link>
                </p>
            </div>
        </AuthPage>
    );
};