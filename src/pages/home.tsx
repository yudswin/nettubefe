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
import { Content } from "../types/content";
import { CollectionService } from '@services/collection.service'
import { LoadingSpinner } from '@components/feedback/LoadingSpinner'
import { Toast } from '@components/feedback/Toast'
import CollectionCard from '@components/user/CollectionCard'
import { useNavigate } from 'react-router-dom'
import TopicContentRow from '@components/user/TopicContentRow'
import HeroHeadline from '@components/user/HeroHeadline'
import LazyLoad from '@components/layout/LayzyLoad'

const HomeContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'admin' | 'settings'>('home');
    const [selectedLibrary, setSelectedLibrary] = useState<number | null>(null);
    const [isAdmin] = useState(true);
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [collectionList, setCollectionList] = useState<Collection[]>([]);
    const [collectionTopicList, setCollectionTopicList] = useState<Content[]>([]);
    const [collectionCount, setCollectionCount] = useState(0);

    const [isHeadlineLoading, setIsHeadlineLoading] = useState(false);
    const [headlineCollection, setHeadlineCollection] = useState<Collection>();
    const [headlineContents, setHeadlineContents] = useState<Content[]>([]);

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

    const groupedByCollection = collectionTopicList.reduce((groups, content) => {
        const slug = content.collectionSlug || 'uncategorized';
        if (!groups[slug]) {
            groups[slug] = {
                collectionName: content.collectionName || 'Uncategorized',
                collectionSlug: slug,
                contents: []
            };
        }
        groups[slug].contents.push(content);
        return groups;
    }, {} as Record<string, { collectionName: string; collectionSlug: string; contents: Content[] }>);

    const collectionGroups = Object.values(groupedByCollection);

    const topicGradients = [
        'from-blue-400 to-white',
        'from-red-400 to-white',
        'from-orange-400 to-white',
    ];

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

    const fetchTopicCollection = async () => {
        try {
            setIsLoading(true);
            const response = await CollectionService.getTopicCollectionContents();

            if (response.status === 'success') {
                setCollectionTopicList(response.result);
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

    const fetchHeadlineCollectionAndContent = async () => {
        try {
            setIsHeadlineLoading(true);
            const response = await CollectionService.getHeadlineCollection();
            if (response.status === 'success') {
                setHeadlineCollection(response.result);
                const contents = await CollectionService.getCollectionContentById(response.result._id, 5)
                if (contents.status === 'success') {
                    setHeadlineContents(contents.result)
                } else {
                    setToast({
                        show: true,
                        message: response.msg || 'Failed to load contents',
                        type: 'error'
                    });
                }
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load collection',
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
            setIsHeadlineLoading(false);
        }
    };

    useEffect(() => {
        fetchCollection();
        fetchTopicCollection();
        fetchHeadlineCollectionAndContent();
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
                    ) : (
                        <>
                            {isHeadlineLoading && <LoadingSpinner />}
                            {headlineContents.length != 0 ? (
                                <HeroHeadline contentList={headlineContents} collection={headlineCollection} />
                            ) : (
                                <div className="p-8 text-gray-400 text-center">
                                    No headline contents available
                                </div>
                            )}

                            <section className={`mb-8 ${collectionList.length == 0 ? "hidden" : ""}`}>
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

                                <div className={`flex flex-row gap-3 py-5 px-4 space-x-4 overflow-x-auto overflow-y-clip scrollbar-hide`}>
                                    {collectionList.length > 0 ? (
                                        collectionList.filter(item => item.type === 'hot').slice(0, 5).map((collection, index) => (
                                            <CollectionCard
                                                key={collection._id || collection.slug || `collection-${index}`}
                                                name={collection.name}
                                                slug={collection.slug}
                                                index={index % collectionList.length}
                                                className={`${gradients[index % gradients.length]}/50`}
                                            />
                                        ))
                                    ) : (
                                        !isLoading && <div className="text-gray-400">No content available</div>
                                    )}
                                    <div
                                        className="w-66 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => navigate('/collection')}
                                    >
                                        <div className={`h-48 rounded-lg mb-2 bg-gray-800 flex items-center justify-center  `}>
                                            <span className="text-white text-2xl font-medium px-2 text-center">
                                                +{collectionCount - 5} Collections
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8 p-8 bg-gradient-to-b from-[#272b3a] to-gray-900 rounded-2xl">
                                {isLoading ? (
                                    <div className="p-8 flex justify-center">
                                        <LoadingSpinner />
                                    </div>
                                ) : collectionGroups.length > 0 ? (
                                    collectionGroups.map((group, index) => (
                                        <TopicContentRow
                                            key={group.collectionSlug || `collection-group-${index}`}
                                            title={group.collectionName}
                                            slug={group.collectionSlug}
                                            items={group.contents}
                                            className={`${topicGradients[index % gradients.length]}`}
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-gray-400 text-center">
                                        No collections available
                                    </div>
                                )}
                            </section>

                            <LazyLoad>
                                {(() => {
                                    let topicCount = 0;
                                    return collectionList
                                        .filter(item => {
                                            if (item.type === "topic") {
                                                topicCount++;
                                                return topicCount > 3;
                                            }
                                            return !(item.type === "features" && item.publish === true);
                                        })
                                        .map((collection) => (
                                            <ContentRow key={collection._id} collection={collection} />
                                        ));
                                })()}
                            </LazyLoad>
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