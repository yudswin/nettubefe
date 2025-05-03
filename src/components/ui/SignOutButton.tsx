import { useLanguage } from '@contexts/LanguageContext';
import { useAuth } from '@contexts/AuthContext';

const SignOutButton = () => {
    const { t } = useLanguage()
    const { logout } = useAuth();

    const toggleSignout = () => {
        logout()
    };

    return (
        <button
            onClick={toggleSignout}
            className="flex items-center space-x-1 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md"
        >
            <span>{t.logout}</span>
            <span>↩️</span>
        </button>
    );
};

export default SignOutButton;
