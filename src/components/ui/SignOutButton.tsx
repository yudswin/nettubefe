import { useLanguage } from '@contexts/LanguageContext';
import { useAuth } from '@contexts/AuthContext';

const SignOutButton = () => {
    const { t } = useLanguage()
    const { logout } = useAuth();

    const toggleLanguage = () => {
        logout()
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md"
        >
            <span>{t.logout}</span>
            <span>↩️</span>
        </button>
    );
};

export default SignOutButton;
