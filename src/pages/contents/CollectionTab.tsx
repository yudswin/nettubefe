import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { Toast } from '@components/feedback/Toast';
import { useEffect, useState } from 'react'
import { Collection } from "../../types/collection";
import CreateCollectionModal from '@components/create/CreateCollectionModal';
import CollectionCard from '@components/ui/CollectionCard';
import { CollectionService } from '@services/collection.service';


const CollectionTab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [collectionList, setCollectionList] = useState<Collection[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCollectionCreated = (newCollection: Collection) => {
        setCollectionList(prev => [...prev, newCollection]);
    };

    const handleUpdateCollection = (updateCollection: Collection) => {
        setCollectionList(prev => prev.map(collection =>
            collection._id === collection._id ? updateCollection : collection
        ));
    };

    const handleDeleteCollection = (deletedId: string) => {
        setCollectionList(prev => prev.filter(collection => collection._id !== deletedId));
    };

    const fetchCollection = async () => {
        try {
            setIsLoading(true);
            const response = await CollectionService.getCollectionList();

            if (response.status === 'success') {
                setCollectionList(response.result);
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCollection();
    }, []);


    return (
        <div className="p-4">
            {isLoading && <LoadingSpinner />}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold mb-6">Collections Library</h2>
                <button
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 btn btn-ghost"
                    onClick={() => setShowCreateModal(true)}>
                    Add New Collection
                </button>
            </div>
            <CreateCollectionModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCollectionCreated={handleCollectionCreated}
            />

            <div className="flex flex-wrap gap-8">
                {collectionList.length > 0 ? (
                    collectionList.map((collection) => (
                        <CollectionCard
                            key={collection._id}
                            _id={collection._id}
                            name={collection.name}
                            slug={collection.slug}
                            description={collection.description}
                            type={collection.type}
                            publish={collection.publish}
                            onDelete={handleDeleteCollection}
                            onUpdate={handleUpdateCollection}
                        />
                    ))
                ) : (
                    !isLoading && <div className="text-gray-400">No content available</div>
                )}
            </div>
        </div >
    );
}

export default CollectionTab