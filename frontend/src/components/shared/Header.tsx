import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {LanguageSwitch} from './LanguageSwitch'
import {useTranslation} from "react-i18next";
import {baseAuthService} from "@/auth/services/baseAuthService";
import {SuccessAlert} from "@/auth/components/SuccessAlert";
import {useBaseAuthContext} from "@/auth/hooks/useBaseAuthContext";
import {Authority} from "@/auth/types/roles";

interface HeaderProps {
    title: string;
    navigation: {
        addProject?: string;
        projects?: string;
        contact?: string;
        login: string;
        logout?: string;
        kafkaDashboard?: string
    }
}

export const Header: React.FC<HeaderProps> = ({title, navigation}) => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const isAuthenticated = baseAuthService.isAuthenticated();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const {hasAuthority} = useBaseAuthContext();

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault()
        const element = document.getElementById(id);
        const headerOffset = 64;
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleAuthAction = () => {
        if (isAuthenticated) {
            baseAuthService.logout();
            setShowLogoutAlert(true);
        } else {
            navigate("/login");
        }
    }

    const handleLogoutAlertClose = () => {
        setShowLogoutAlert(false);
        window.location.reload();
    }

    return (
        <>
            <header className={"bg-white shadow fixed top-0 right-0 w-full z-50"}>
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto">
                        <div className="flex justify-between h-16 items-center">
                            <div
                                onClick={() => navigate('/')}
                                className="text-xl font-bold cursor-pointer hover:text-gray-700"
                            >
                                {title}
                            </div>
                            <div className="flex space-x-4">
                                {hasAuthority(Authority.CREATE_PROJECTS) && navigation.addProject && (
                                    <button
                                        onClick={() => navigate('/add-project')}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        {navigation.addProject}
                                    </button>
                                )}

                                <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}
                                   className="text-gray-700 hover:text-gray-900">{navigation.contact}</a>
                                <button
                                    onClick={handleAuthAction}
                                    className="text-gray-700 hover:text-gray-900">
                                    {isAuthenticated ? (navigation.logout || t('header.navigation.logout')) : navigation.login}
                                </button>
                                <LanguageSwitch/>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <SuccessAlert isOpen={showLogoutAlert}
                          onClose={handleLogoutAlertClose}
                          title={t('logout.success.title')}
                          description={t('logout.success.description')}
            />
        </>
    );
};