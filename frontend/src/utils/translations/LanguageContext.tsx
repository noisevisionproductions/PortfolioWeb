import React, {createContext, useState, useContext} from 'react';
import {Language, translations} from "./translations";

const LanguageContext = createContext<{
    language: Language;
    currentLanguage: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}>({
    language: 'pl',
    currentLanguage: 'pl',
    setLanguage: () => {
    },
    t: () => ''
});

export const LanguageProvider = ({children}: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('pl');

    const t = (path: string): string => {
        return path.split('.').reduce((obj: any, key: string) => {
            if (obj && typeof obj === 'object' && key in obj) {
                return obj[key];
            }
            console.warn(`Translation missing for key: ${path}, at segment: ${key}`);
            return path;
        }, translations[language]);

    };

    const currentLanguage = language;

    return (
        <LanguageContext.Provider value={{language, currentLanguage, setLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext)