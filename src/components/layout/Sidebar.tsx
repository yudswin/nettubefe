import AuthModel from '@components/ui/AuthModel';
import SignOutButton from '@components/ui/SignOutButton';
import { useAuth } from '@contexts/AuthContext';
import { useLanguage } from '@contexts/LanguageContext';
import { useEffect, useState } from 'react';
interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    activeTab: 'home' | 'library' | 'admin' | 'settings';
    onTabChange: (tab: 'home' | 'library' | 'admin' | 'settings') => void;
    onSelectLibrary: (id: number) => void; // New prop for library selection
    selectedLibrary: number | null; // New prop to track selected library
    isAdmin?: boolean; // Admin state
}

export const Sidebar = ({
    isOpen,
    toggleSidebar,
    activeTab,
    onTabChange,
    onSelectLibrary,
    selectedLibrary
}: SidebarProps) => {
    const [isAuth, setIsAuth] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();


    // const libraries = [
    //     { id: 1, name: t.movies, icon: '🎬' },
    //     { id: 2, name: t.tvShows, icon: '📺' },
    //     { id: 3, name: t.music, icon: '🎵' },
    //     { id: 4, name: t.photos, icon: '📷' },
    // ];

    useEffect(() => {
        setIsAuth(isAuthenticated || !!user)
    }, [isAuthenticated, user])

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            {/* Mobile overlay when sidebar is open */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 pt-16 bottom-0 bg-gray-950 transition-all duration-300 ease-in-out z-20
                ${isOpen ? 'left-0' : '-left-64'}
                w-64 md:w-56
                ${isOpen ? 'shadow-2xl' : ''}`}>

                <div>
                    <div className="p-4 h-full overflow-y-auto">
                        <nav>
                            <ul>
                                <li className="mb-1">
                                    <button
                                        onClick={() => onTabChange('home')}
                                        className={`w-full text-left flex items-center px-4 py-3 rounded-md ${activeTab === 'home'
                                            ? 'bg-gray-800 border-l-4 border-amber-500'
                                            : 'hover:bg-gray-800'
                                            }`}
                                    >
                                        <span>{t.home}</span>
                                    </button>
                                </li>

                                {/* Libraries Section
                            {libraries.map(library => (
                                <li key={library.id} className="mb-1">
                                    <button
                                        onClick={() => {
                                            onTabChange('library');
                                            onSelectLibrary(library.id);
                                        }}
                                        className={`w-full text-left flex items-center px-4 py-3 rounded-md ${selectedLibrary === library.id && activeTab === 'library'
                                            ? 'bg-gray-800 border-l-4 border-amber-500'
                                            : 'hover:bg-gray-800'
                                            }`}
                                    >
                                        <span className="mr-3">{library.icon}</span>
                                        <span>{library.name}</span>
                                    </button>
                                </li>
                            ))} */}

                                {/* Admin Tab */}
                                {user?.roles === 'admin' && (
                                    <li className="mb-1">
                                        <button
                                            onClick={() => onTabChange('admin')}
                                            className={`w-full text-left flex items-center px-4 py-3 rounded-md ${activeTab === 'admin'
                                                ? 'bg-gray-800 border-l-4 border-amber-500'
                                                : 'hover:bg-gray-800'
                                                }`}
                                        >
                                            <span className="mr-3">🛡️</span>
                                            <span>{t.tabAdmin}</span>
                                        </button>
                                    </li>
                                )}

                                {/* Settings Tab */}
                                <li className="mt-6 mb-1">
                                    <button
                                        onClick={() => onTabChange('settings')}
                                        className={`w-full text-left flex items-center px-4 py-3 rounded-md ${activeTab === 'settings'
                                            ? 'bg-gray-800 border-l-4 border-amber-500'
                                            : 'hover:bg-gray-800'
                                            }`}
                                    >
                                        <span className="mr-3">⚙️</span>
                                        <span>{t.tabSetting}</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        <div className='md:hidden flex flex-col'>
                            <div className="border-t h-3 w-full border-amber-500 p-2"></div>
                            {!isAuth ?
                                // Auth Title
                                <>
                                    <div className="md:flex items-center ml-4">
                                        <button
                                            onClick={handleCardClick}
                                            className={`w-full text-left flex items-center px-4 py-3 rounded-md hover:bg-gray-800`}
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
                                    <div
                                        className={`w-full text-left flex items-center px-4 py-3 rounded-md`}
                                    >
                                        <span className='md:flex items-center ml-4'>{user?.name ? user.name : t.user}</span>
                                    </div>
                                    <div
                                        className={`md:flex boder-2  border-amber-500 ml-4 w-full text-left flex items-center px-4 py-3 rounded-md hover:bg-gray-800`}
                                    >
                                        <SignOutButton />
                                    </div>
                                </>
                            }
                        </div>

                    </div>
                </div>
            </aside>

            {/* Toggle sidebar button for desktop */}
            <button
                onClick={toggleSidebar}
                className="hidden md:block fixed top-20 z-30 bg-amber-500 rounded-r-md p-2 shadow-lg transition-all duration-300"
                style={{ left: isOpen ? '14rem' : '0' }}
                aria-label="Toggle sidebar"
            >
                {isOpen ? '◀' : '▶'}
            </button>
        </>
    )
}