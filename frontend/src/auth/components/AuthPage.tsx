import React from 'react';
import {Header} from "../../components/shared/Header";

interface AuthPageProps {
    children: React.ReactNode;
    title: string;
    navigation: {
        login: string;
    };
}

export const AuthPage: React.FC<AuthPageProps> = ({children, title, navigation}) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header title={title} navigation={navigation}/>
            <main className="max-w-lg mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};