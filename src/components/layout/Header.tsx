import LanguageSwitcher from '../ui/LanguageSwitcher'
import { useLanguage } from '../../contexts/LanguageContext'
import { useEffect, useState } from 'react';
import AuthModel from '../ui/AuthModel';
import { useAuth } from '@contexts/AuthContext';
import SignOutButton from '@components/ui/SignOutButton';
import SearchBox from '@components/search/SearchBox';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    toggleSidebar: () => void;
    sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
    const { t } = useLanguage();
    const [modalOpen, setModalOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false)
    const { user, isAuthenticated } = useAuth();

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const navigate = useNavigate()

    useEffect(() => {
        setIsAuth(isAuthenticated || !!user)
    }, [isAuthenticated, user])


    return (
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-4 md:px-8 bg-gray-950 h-16 border-b border-gray-800 z-30">
            {/* Mobile sidebar toggle */}
            <button
                onClick={toggleSidebar}
                className="md:hidden text-white p-2"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* App name */}
            <div className="text-2xl font-bold text-amber-500 hover:cursor-pointer"
            onClick={() => navigate('/')}
            >
                {t.appName}
            </div>
            <SearchBox />
            {/* Right section with language and user */}
            <div className="md:flex items-center gap-4 hidden">
                <LanguageSwitcher />

                {/* User profile (hidden on mobile) */}
                {!isAuth ?
                    // Auth Title
                    <>
                        <div className="hidden md:flex items-center ml-4">
                            <button
                                onClick={handleCardClick}
                                className="flex items-center space-x-1 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md"
                            >
                                <span>{t.authTitle}</span>
                                <div>
                                    👤
                                </div>
                            </button>
                        </div>
                        <AuthModel
                            isOpen={modalOpen}
                            onClose={handleCloseModal}
                        />
                    </>
                    :  // Signed In
                    <>
                        <div className="flex items-center space-x-1 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md">
                            <span>{user?.name ? user.name : t.user}</span>
                        </div>
                        <div>
                            <SignOutButton />
                        </div>
                    </>
                }
            </div>
        </header >
    )
}

export default Header
