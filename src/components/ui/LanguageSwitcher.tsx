import { useLanguage } from '../../contexts/LanguageContext';
import { LANGUAGE_NAMES } from '../../constants/language';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'vi' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md"
        >
            <span>{LANGUAGE_NAMES[language]}</span>
            <span>🌐</span>
        </button>
    );
};

export default LanguageSwitcher;
