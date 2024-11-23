import React, {useState} from "react";
import {Header} from "../Header";
import {useLanguage} from "../../../utils/translations/LanguageContext";
import programmingLanguages from '../../../assets/programmingLanguages.json'
import {authService} from "../../../services/authService";
import {useNavigate} from "react-router-dom";
import {FormInput} from "./FormInput";
import {LanguageSelector} from "./ProgrammingLanguageSelector";
import {SuccessAlert} from "./SuccessAlert";
import {AuthError, ValidationError} from "../../../types/errors";

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const {t, currentLanguage} = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        companyName: '',
        programmingLanguages: [] as string[]
    });
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const allLanguages = [
        ...programmingLanguages.languages,
        programmingLanguages.other[currentLanguage as keyof typeof programmingLanguages.other]
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});

        try {
            await authService.register(formData);
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
    }

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {t(`register.errors.${error}`)}
                    </div>
                )}

                <FormInput
                    id="name"
                    label={t('register.name')}
                    value={formData.name}
                    onChange={handleInputChange('name')}
                />

                <FormInput
                    id="companyName"
                    label={t('register.companyName')}
                    value={formData.companyName}
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
                    selected={formData.programmingLanguages}
                    onChange={(selected) => setFormData(prev => ({...prev, selectedLanguages: selected}))}
                />

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t('register.submit')}
                    </button>
                </div>
            </form>

            <SuccessAlert
                isOpen={showSuccessAlert}
                onClose={handleSuccessAlertClose}
                title={t('register.success.title')}
                description={t('register.success.description')}
            />
        </>
    );
};

export const RegisterPage: React.FC = () => {
    const {t} = useLanguage();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header title={t('header.title')} navigation={{
                login: t('header.navigation.login'),
            }}
            />
            <main className="max-w-lg mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {t('register.title')}
                </h2>
                <RegisterForm/>
            </main>
        </div>
    )
}