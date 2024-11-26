import {useLanguageSwitch} from "../../utils/translations/LanguageContext";

export const LanguageSwitch = () => {
    const { currentLanguage, switchLanguage } = useLanguageSwitch();

    const handleLanguageChange = async () => {
        try {
            await switchLanguage(currentLanguage === 'pl' ? 'en' : 'pl');
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    }

    return (
        <button
            onClick={handleLanguageChange}
            className="px-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
        >
            {currentLanguage.toUpperCase()}
        </button>
    )
}