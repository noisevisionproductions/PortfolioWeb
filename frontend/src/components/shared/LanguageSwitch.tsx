import {useLanguage} from "../../utils/translations/LanguageContext";

export const LanguageSwitch = () => {
    const {language, setLanguage} = useLanguage()

    return (
        <button
            onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
            className="px-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
        >
            {language.toUpperCase()}
        </button>
    )
}