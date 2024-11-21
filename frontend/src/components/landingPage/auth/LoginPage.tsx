import React, {useState} from 'react';
import {Header} from '../Header'
import {useLanguage} from "../../../utils/translations/LanguageContext";
import {Link} from 'react-router-dom';
import {Eye, EyeOff} from "lucide-react";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {t} = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        console.log('Login submitted', {email, password});
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('login.email')}
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
                    {t('login.password')}
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type="password"
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
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ouline-none foucs:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {t('login.submit')}
                </button>
            </div>
        </form>
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
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            {t('login.register')}
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};