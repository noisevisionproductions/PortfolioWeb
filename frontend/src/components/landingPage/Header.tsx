import React from 'react';
import {useNavigate} from "react-router-dom";
import {LanguageSwitch} from '../LanguageSwitch'

interface HeaderProps {
    title: string;
    navigation: {
        about?: string;
        projects?: string;
        contact?: string;
        login: string;
    };
    onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({title, navigation, onLoginClick}) => {
    const navigate = useNavigate();

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

    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick();
        } else {
            navigate('/login');
        }
    }

    return (
        <header className={"bg-white shadow fixed top-0 right-0 w-full z-50"}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div
                        onClick={() => navigate('/')}
                        className="text-xl font-bold cursor-pointer hover:text-gray-700"
                    >
                        {title}
                    </div>
                    <div className="flex space-x-4">
                        <a href="#about" onClick={(e) => scrollToSection(e, 'about')}
                           className="text-gray-700 hover:text-gray-900">{navigation.about}</a>
                        <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}
                           className="text-gray-700 hover:text-gray-900">{navigation.projects}</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}
                           className="text-gray-700 hover:text-gray-900">{navigation.contact}</a>
                        <button
                            onClick={handleLoginClick}
                            className="text-gray-700 hover:text-gray-900">
                            {navigation.login}
                        </button>
                        <LanguageSwitch/>
                    </div>
                </div>
            </nav>
        </header>
    );
};