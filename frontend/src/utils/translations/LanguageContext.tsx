import React, {createContext, useContext} from 'react';
import {Language} from "./translations";
import {useTranslation} from "react-i18next";

const LanguageContext = createContext<{
    language: Language;
    currentLanguage: Language;
    switchLanguage: (lang: Language) => Promise<void>;
}>({
    language: 'pl',
    currentLanguage: 'pl',
    switchLanguage: async () => {
    },
});

export const LanguageProvider = ({children}: { children: React.ReactNode }) => {
    const {i18n} = useTranslation();

    const switchLanguage = async (lang: Language) => {
        try {
            await i18n.changeLanguage(lang);
            localStorage.setItem('language', lang);
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    return (
        <LanguageContext.Provider value={{
            language: i18n.language as Language,
            currentLanguage: i18n.language as Language,
            switchLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguageSwitch = () => useContext(LanguageContext);