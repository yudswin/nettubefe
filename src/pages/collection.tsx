import Header from '@components/layout/Header'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingSpinner } from '@components/feedback/LoadingSpinner'
import Breadcrumb from '@components/layout/Breadcrumb'
import { Collection } from '../types/collection'
import { Content } from '../types/content'
import ContentCard from '@components/user/ContentCard'
import { CollectionService } from '@services/collection.service'

const collection = () => {
    const { slug } = useParams<{ slug: string }>()
    const [isLoading, setIsLoading] = useState(true)
    const [collection, setCollection] = useState<Collection>()
    const [contentList, setContentList] = useState<Content[]>([]);

    const [, setToast] = useState<{
        show: boolean
        message: string
        type: 'success' | 'error'
    }>({ show: false, message: '', type: 'success' })

    const fetchCollection = async () => {
        try {
            setIsLoading(true)
            if (slug) {
                const response = await CollectionService.getCollectionBySlug(slug)
                if (response.status === 'success') {
                    setCollection(response.result)
                } else {
                    setToast({
                        show: true,
                        message: response.msg || 'Failed to load collection',
                        type: 'error'
                    })
                }
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCollectionContents = async () => {
        try {
            setIsLoading(true);
            if (collection?._id) {
                const response = await CollectionService.getCollectionContentById(collection._id);

                if (response.status === 'success') {
                    setContentList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.msg || 'Failed to load content',
                        type: 'error'
                    });
                }
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
        fetchCollection()
    }, [slug])

    useEffect(() => {
        if (collection?._id) {
            fetchCollectionContents()
        }
    }, [collection])

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div>
                    <Header toggleSidebar={() => { }} sidebarOpen={false} />
                    {collection ? (
                        <div className="max-w-7xl mx-auto px-4 py-40">
                            {/* Hero Section */}
                            <div className='max-w-md rounded-xl shadow-2xl bg-amber-500' />
                            <div className="hero mb-8">
                                <div className="hero-content flex-col lg:flex-row gap-8">
                                    <div className="flex flex-col gap-4">
                                        <h1 className="text-5xl font-bold">
                                            {collection.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="grid gap-8">
                                <div className="text-lg">
                                    <Breadcrumb currentPage={collection.name} returnPath='collection' />
                                </div>
                                {/* Content List */}
                                <div className="flex flex-wrap gap-8">
                                    {contentList.length > 0 ? (
                                        contentList.map((content) => (
                                            <ContentCard
                                                key={content._id}
                                                content={content}
                                            />
                                        ))
                                    ) : (
                                        !isLoading && <div className="text-gray-400">No content available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-error max-w-7xl mx-auto my-8">
                            <div className="flex-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <label>Collection not found</label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default collection