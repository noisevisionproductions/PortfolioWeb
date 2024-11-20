import React, {createContext, useState, useContext} from 'react';
import {Language, translations} from "./translations";

const LanguageContext = createContext<{
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}>({
    language: 'pl',
    setLanguage: () => {
    },
    t: () => ''
});

export const LanguageProvider = ({children}: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('pl');

    const t = (path: string) => {
        // @ts-ignore
        return path.split('.').reduce((obj, key) => obj[key], translations[language]) as unknown as string;
    };

    return (
        <LanguageContext.Provider value={{language, setLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext)