import React, {useState} from "react";
import {Header} from "../Header";
import {useLanguage} from "../../../utils/translations/LanguageContext";
import {Eye, EyeOff} from "lucide-react";
import programmingLanguages from '../../../assets/programmingLanguages.json'

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword] = useState('');
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const {t, currentLanguage} = useLanguage();

    const allLanguages = [
        ...programmingLanguages.languages,
        programmingLanguages.other[currentLanguage as keyof typeof programmingLanguages.other]
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Registration submitted', {
            email,
            password,
            confirmPassword,
            name,
            companyName,
            selectedLanguages
        });
    };

    const toggleLanguage = (language: string) => {
        setSelectedLanguages(prev =>
            prev.includes(language)
                ? prev.filter(lang => lang !== language)
                : [...prev, language]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('register.name')}
                </label>
                <input
                    id="name"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    {t('register.companyName')}
                </label>
                <input
                    id="companyName"
                    type="text"
                    aria-multiline={"false"}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('register.email')}
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('register.password')}
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pl-3 pr-3 flex items-center mt-1 text-gray-600 hover:text-gray-800"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5"/>
                        ) : (
                            <Eye className="h-5 w-5"/>
                        )}
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.programmingLanguages')}
                </label>
                <div className="flex flex-wrap gap-2">
                    {allLanguages.map((language) => (
                        <button
                            key={language}
                            type="button"
                            onClick={() => toggleLanguage(language)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedLanguages.includes(language)
                                    ? 'bg-primary text-white'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                            }`}
                        >
                            {language}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {t('register.submit')}
                </button>
            </div>
        </form>
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