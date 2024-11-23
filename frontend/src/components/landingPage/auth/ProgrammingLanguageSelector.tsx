import React from "react";

interface ProgrammingLanguageSelectorProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export const LanguageSelector: React.FC<ProgrammingLanguageSelectorProps> = ({
                                                                                 label,
                                                                                 options,
                                                                                 selected,
                                                                                 onChange
                                                                             }) => {
    const toggleLanguage = (language: string) => {
        onChange(
            selected.includes(language)
                ? selected.filter(lang => lang !== language)
                : [...selected, language]
        );
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="flex flex-wrap gap-2">
                {options.map((language) => (
                    <button
                        key={language}
                        type="button"
                        onClick={() => toggleLanguage(language)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selected.includes(language)
                                ? 'bg-primary text-white'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                    >
                        {language}
                    </button>
                ))}
            </div>
        </div>
    );
};