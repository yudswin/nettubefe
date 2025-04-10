import Header from '../components/layout/Header'
import ContentRow from '../components/ui/ContentRow'
import Footer from '../components/layout/Footer'
import Sidebar from '../components/layout/Sidebar'
import { useState } from 'react'
import { LanguageProvider } from '../contexts/LanguageContext'
import { useLanguage } from '../contexts/LanguageContext'

const HomeContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { t } = useLanguage();

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

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 transition-all duration-300 ease-in-out pt-16
                ${sidebarOpen ? 'md:ml-56' : 'md:ml-0'} ml-0`}>
                <main className="p-4 md:p-8 overflow-y-auto">
                    {/* Hero Section */}
                    <section className="mb-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 h-48 md:h-72 flex items-center px-6 md:px-8">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold mb-2">{t.welcomeBack}</h1>
                            <p className="text-base md:text-xl">{t.continueWatchingPrompt}</p>
                        </div>
                    </section>

                    {/* Content Rows */}
                    <ContentRow title={t.continueWatching} items={continueWatching} type="continue" />
                    <ContentRow title={t.recentlyAdded} items={recentlyAdded} type="recent" />
                </main>

                <Footer />
            </div>
        </div>
    )
}

const Home = () => {
    return (
        <LanguageProvider>
            <HomeContent />
        </LanguageProvider>
    )
}

export default Home