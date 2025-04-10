import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
    const { t } = useLanguage();
    
    const libraries = [
        { id: 1, name: t.movies, icon: '🎬' },
        { id: 2, name: t.tvShows, icon: '📺' },
        { id: 3, name: t.music, icon: '🎵' },
        { id: 4, name: t.photos, icon: '📷' },
    ]

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
                
                <div className="p-4 h-full overflow-y-auto">
                    {/* Mobile search bar */}
                    <div className="mb-4 md:hidden">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                className="w-full bg-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <span className="absolute right-3 top-2.5">🔍</span>
                        </div>
                    </div>

                    <nav>
                        <ul>
                            <li className="mb-1">
                                <a href="#" className="flex items-center px-4 py-3 rounded-md bg-gray-800 border-l-4 border-amber-500">
                                    <span>{t.home}</span>
                                </a>
                            </li>

                            {libraries.map(library => (
                                <li key={library.id} className="mb-1">
                                    <a href="#" className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800">
                                        <span className="mr-3">{library.icon}</span>
                                        <span>{library.name}</span>
                                    </a>
                                </li>
                            ))}

                            <li className="mt-6 mb-1">
                                <a href="#" className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800">
                                    <span>{t.settings}</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Mobile profile section */}
                    <div className="md:hidden mt-8 border-t border-gray-800 pt-4">
                        <div className="flex items-center px-4 py-2">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                                👤
                            </div>
                            <div>
                                <div className="font-medium">{t.user}</div>
                                <div className="text-sm text-gray-400">user@example.com</div>
                            </div>
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

export default Sidebar
