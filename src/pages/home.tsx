import Header from '../components/layout/Header'
import ContentRow from '../components/ui/ContentRow'
import Footer from '../components/layout/Footer'
import { Sidebar } from '../components/layout/Sidebar'
import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { LibraryContent } from './contents/LibraryContent'
import AdminContent from './contents/AdminContent'
import SettingContent from './contents/SettingContent'
import { Collection } from "../types/collection";
import { CollectionService } from '@services/collection.service'
import { LoadingSpinner } from '@components/feedback/LoadingSpinner'
import { Toast } from '@components/feedback/Toast'
import CollectionCard from '@components/user/CollectionCard'
import { useNavigate } from 'react-router-dom'

const HomeContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'home' | 'library' | 'admin' | 'settings'>('home');
    const [selectedLibrary, setSelectedLibrary] = useState<number | null>(null);
    const [isAdmin] = useState(true); // Replace with real auth check
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [collectionList, setCollectionList] = useState<Collection[]>([]);
    const [collectionCount, setCollectionCount] = useState(0);

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });


    const gradients = [
        'bg-gradient-to-br from-blue-500 to-indigo-600',
        'bg-gradient-to-br from-red-400 to-gray-600',
        'bg-gradient-to-br from-emerald-500 to-teal-600',
        'bg-gradient-to-br from-purple-400 to-indigo-500',
        'bg-gradient-to-br from-orange-300 to-red-400',
    ];

    // Mock data for demonstration
    const continueWatching = [
        { id: 1, title: 'Movie 1', image: '/placeholder.jpg', progress: 45 },
        { id: 2, title: 'TV Show 1', image: '/placeholder.jpg', progress: 60 },
        { id: 3, title: 'Movie 2', image: '/placeholder.jpg', progress: 20 },
        { id: 4, title: 'TV Show 2', image: '/placeholder.jpg', progress: 80 },
    ]

    const recentlyAdded = [
        { id: 5, title: 'New Movie 1', image: '/placeholder.jpg', added: '2 days ago' },
        { id: 6, title: 'New TV Show 1', image: '/placeholder.jpg', added: '1 day ago' },
        { id: 7, title: 'New Movie 2', image: '/placeholder.jpg', added: '5 hours ago' },
        { id: 8, title: 'New TV Show 2', image: '/placeholder.jpg', added: 'Just now' },
    ]

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const fetchCollection = async () => {
        try {
            setIsLoading(true);
            const response = await CollectionService.getHotCollections();

            if (response.status === 'success') {
                setCollectionList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load collection',
                    type: 'error'
                });
            }

            const responseCount = await CollectionService.getTotal();
            if (responseCount.status === 'success') {
                setCollectionCount(responseCount.result.total);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load collection total',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCollection();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSelectLibrary={setSelectedLibrary}
                selectedLibrary={selectedLibrary}
                isAdmin={isAdmin}
            />

            <div className={`flex-1 transition-all duration-300 ease-in-out pt-16
                ${sidebarOpen ? 'md:ml-56' : 'md:ml-0'} ml-0`}>

                <main className="p-4 md:p-8 overflow-y-auto">
                    {activeTab === 'settings' ? (
                        <SettingContent />
                    ) : activeTab === 'admin' ? (
                        <AdminContent />
                    ) : activeTab === 'library' ? (
                        <LibraryContent libraryId={selectedLibrary} />
                    ) : (
                        <>
                            <section className="mb-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 h-48 md:h-72 flex items-center px-6 md:px-8">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold mb-2">{t.welcomeBack}</h1>
                                    <p className="text-base md:text-xl">{t.continueWatchingPrompt}</p>
                                </div>
                            </section>

                            <section className="mb-8">
                                {isLoading && <LoadingSpinner />}
                                {toast.show && (
                                    <Toast
                                        message={toast.message}
                                        type={toast.type}
                                        onClose={() => setToast(prev => ({ ...prev, show: false }))}
                                    />
                                )}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">What are you looking for today?</h2>
                                </div>

                                <div className='flex flex-row gap-3'>
                                    {collectionList.length > 0 ? (
                                        collectionList.filter(item => item.type === 'hot').map((collection, index) => (
                                            <CollectionCard
                                                name={collection.name}
                                                slug={collection.slug}
                                                className={`${gradients[index % gradients.length]}/50`}
                                            />
                                        ))
                                    ) : (
                                        !isLoading && <div className="text-gray-400">No content available</div>
                                    )}
                                    <div
                                        className="w-44 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => navigate('/collection')}
                                    >
                                        <div className={`h-32 rounded-lg mb-2 bg-gray-800 flex items-center justify-center  `}>
                                            <span className="text-white  font-medium px-2 text-center">
                                                +{collectionCount - 5} Collections
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <ContentRow title={t.continueWatching} items={continueWatching} type="continue" />
                            <ContentRow title={t.recentlyAdded} items={recentlyAdded} type="recent" />
                        </>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    )
}

const Home = () => {
    return (
        <HomeContent />
    )
}

export default Home