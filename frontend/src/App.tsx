import React, {useEffect, useState} from 'react';
import {Header} from "./components/landingPage/Header";
import {useLanguage} from "./utils/translations/LanguageContext";
import {HeroSection} from "./components/landingPage/HeroSection";
import {ProjectSection} from "./components/landingPage/ProjectSection";
import {ContactSection} from "./components/landingPage/ContactSection";
import {useProjects} from './hooks/useProjects';
import {LoginPage} from "./components/landingPage/auth/LoginPage";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import {RegisterPage} from "./components/landingPage/auth/RegisterPage";

function MainContent() {
    const {t} = useLanguage();
    const {projects, isLoading, error} = useProjects();
    const [, setShowTimeoutError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (isLoading) {
            timer = setTimeout(() => {
                setShowTimeoutError(true);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [isLoading]);

    const handleLogin = () => {
        navigate('/login')
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                title={t('header.title')}
                navigation={{
                    about: t('header.navigation.about'),
                    projects: t('header.navigation.projects'),
                    contact: t('header.navigation.contact'),
                    login: t('header.navigation.login')
                }}
                onLoginClick={handleLogin}
            />
            <main className="pt-16">
                <HeroSection
                    title={t('heroSection.title')}
                    description={t('heroSection.description')}
                    githubUrl="https://github.com/noisevisionproductions/"
                    linkedInLink="https://www.linkedin.com/in/tomasz-jurczyk/"
                    emailAddress="tomasz.jurczyk95@gmail.com"
                />
                <section id="projects" className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold mb-8">{t('projectSection.title')}</h2>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"/>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 text-red-600">
                                {error}
                            </div>
                        ) : (
                            <ProjectSection projects={projects}/>
                        )}
                    </div>
                </section>
                <ContactSection
                    contact={t('contactSection.contact')}
                    message={t('contactSection.message')}
                    submit={t('contactSection.submit')}
                />
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainContent/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;