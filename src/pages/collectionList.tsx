import { useEffect, useState } from 'react'
import Header from '@components/layout/Header'
import { LoadingSpinner } from '@components/feedback/LoadingSpinner'
import Breadcrumb from '@components/layout/Breadcrumb'
import { Collection } from '../types/collection'
import { CollectionService } from '@services/collection.service'
import { Toast } from '@components/feedback/Toast'
import CollectionCard from '@components/user/CollectionCard'

const CollectionList = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [collections, setCollections] = useState<Collection[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const itemsPerPage = 12

    const [toast, setToast] = useState<{
        show: boolean
        message: string
        type: 'success' | 'error'
    }>({ show: false, message: '', type: 'success' })

    const gradients = [
        'bg-gradient-to-br from-blue-500 to-indigo-600',
        'bg-gradient-to-br from-red-400 to-gray-600',
        'bg-gradient-to-br from-emerald-500 to-teal-600',
        'bg-gradient-to-br from-purple-400 to-indigo-500',
        'bg-gradient-to-br from-orange-300 to-red-400',
    ]
    const fetchCollections = async () => {
        try {
            setIsLoading(true)
            const response = await CollectionService.getCollectionListWithoutFeatures()

            if (response.status === 'success') {
                // Set collections from the response
                setCollections(response.result || [])

                // Fetch total count for pagination
                const countResponse = await CollectionService.getTotal()
                if (countResponse.status === 'success') {
                    setTotalPages(Math.ceil((countResponse.result.total || 0) / itemsPerPage))
                }
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load collections',
                    type: 'error'
                })
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

    useEffect(() => {
        fetchCollections()
    }, [page])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            {isLoading && <LoadingSpinner />}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            <div>
                <Header toggleSidebar={() => { }} sidebarOpen={false} />

                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                    <div className="mb-8">
                        <h1 className="text-6xl font-bold mb-4">Collections</h1>
                        <Breadcrumb currentPage="Collections" />
                    </div>

                    {!isLoading && collections.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-400">No collections available</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-4">
                                {collections.map((collection, index) => (
                                    <div className="">
                                        <CollectionCard
                                            index={index}
                                            key={collection._id}
                                            name={collection.name}
                                            slug={collection.slug}
                                            className={`${gradients[index % gradients.length]}/50`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12">
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-sm"
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                        >
                                            «
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                className={`btn btn-sm ${pageNum === page ? 'btn-active' : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}

                                        <button
                                            className="btn btn-sm"
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CollectionList