import React, {useState} from 'react';
import {Header} from '../shared/Header'
import {useLanguage} from "../../utils/translations/LanguageContext";
import {Link, useNavigate} from 'react-router-dom';
import {authService} from "../../services/authService";
import {ValidationError, AuthError} from "../../types/errors";
import {SuccessAlert} from "./SuccessAlert";
import {FormInput} from "../shared/FormInput";

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');
        setValidationErrors({});

        try {
            await authService.login(formData);
            setShowSuccessAlert(true);
        } catch (err) {
            if (err instanceof ValidationError) {
                setValidationErrors(err.errors);
            } else if (err instanceof AuthError) {
                setError(err.key);
            } else {
                setError('generic');
            }
        }
    };

    const handleSuccessAlertClose = () => {
        setShowSuccessAlert(false);
        navigate('/');
    };

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {t(`login.errors.${error}`)}
                    </div>
                )}

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

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ouline-none foucs:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {t('login.submit')}
                    </button>
                </div>
            </form>

            <SuccessAlert isOpen={showSuccessAlert}
                          onClose={handleSuccessAlertClose}
                          title={t('login.success.title')}
                          description={t('login.success.description')}/>
        </>
    );
};

export const LoginPage: React.FC = () => {
    const {t} = useLanguage();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header title={t('header.title')} navigation={{
                login: t('header.navigation.login')
            }}
            />
            <main className="max-w-lg mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {t('login.title')}
                </h2>
                <LoginForm/>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {t('login.noAccount')}{' '}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            {t('login.register')}
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};