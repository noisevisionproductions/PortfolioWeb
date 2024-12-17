import React, {useEffect, useState} from 'react';
import {Header} from "./components/shared/Header";
import {useTranslation} from "react-i18next";
import {HeroSection} from "./components/landingPage/HeroSection";
import {ProjectSection} from "./projects/components/projectSection/ProjectSection";
import {ContactSection} from "./components/landingPage/ContactSection";
import {Outlet} from "react-router-dom";
import {ProjectProvider, useBaseProject} from "./projects/context";
import {AuthProvider} from "./auth/context/BaseAuthContext";

export function MainContent() {
    const {t} = useTranslation();
    const {projects, loading: isLoading, error, fetchProjects} = useBaseProject();
    const [_, setShowTimeoutError] = useState(false);

    useEffect(() => {
        fetchProjects().catch(console.error);
    }, [fetchProjects]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (isLoading) {
            timer = setTimeout(() => {
                setShowTimeoutError(true);
            }, 5000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isLoading]);

    const safeProjects = Array.isArray(projects) ? projects : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                title={t('header.title')}
                navigation={{
                    addProject: t('header.navigation.addProject'),
                    projects: t('header.navigation.projects'),
                    contact: t('header.navigation.contact'),
                    login: t('header.navigation.login'),
                    kafkaDashboard: t('header.navigation.kafkaDashboard')
                }}
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
                        ) : safeProjects.length === 0 ? (
                            <div className="text-center py-12">
                                {t('projectSection.noProjects')}
                            </div>
                        ) : (
                            <ProjectSection projects={safeProjects}/>
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

const App: React.FC = () => {
    return (
        <React.StrictMode>
            <AuthProvider>
                <ProjectProvider>
                    <Outlet/>
                </ProjectProvider>
            </AuthProvider>
        </React.StrictMode>
    );
}

export default App;