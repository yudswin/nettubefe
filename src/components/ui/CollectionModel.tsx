import { useState, useEffect } from "react";
import { Collection } from "../../types/collection";
import { Content } from "../../types/content";
import { CollectionService } from "../../services/collection.service";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import AddCollectionContentModal from "@components/create/AddCollectionContentModal";
import UpdateCollectionContentModel from "@components/create/UpdateCollectionContentModel";

interface CollectionModelProps {
    collection: Collection;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (deleteId: string) => void;
    onUpdate?: (updatedCollection: Collection) => void;
}

const CollectionModel = ({ collection, isOpen, onClose, onUpdate, onDelete }: CollectionModelProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState(collection);
    const [isLoading, setIsLoading] = useState(false);
    const [contentList, setContentList] = useState<Content[]>([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState<Content | null>();

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: target.checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const fetchContent = async () => {
        try {
            setIsLoading(true);
            const response = await CollectionService.getCollectionContentById(collection._id);

            if (response.status === 'success') {
                setContentList(response.result)
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load content',
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



    const handleNewContent = (newContent: Content) => {
        setContentList(prev => [...prev, newContent])
    }

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const response = await CollectionService.updateCollection(formData._id, formData);

            if (response.status === 'success') {
                setToast({ show: true, message: 'Collection updated successfully', type: 'success' });
                onUpdate?.(formData);
                setIsEditing(false);
            } else {
                setToast({ show: true, message: response.error || 'Update failed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Error updating collection', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setShowConfirmation(false);
        try {
            setIsLoading(true);
            const response = await CollectionService.deleteCollection(formData._id);

            if (response.status === 'success') {
                setToast({ show: true, message: 'Collection deleted successfully', type: 'success' });
                onClose();
                onDelete?.(formData._id);
            } else {
                setToast({ show: true, message: response.error || 'Delete failed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Error deleting collection', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteContent = (deletedId: string) => {
        setContentList(prev => prev.filter(content => content._id !== deletedId));
        setShowUpdateModal(false)
    };

    const handleUpdateContent = (updatedContent: Content) => {
        setContentList(prev => prev.map(content =>
            content._id === updatedContent._id
                ? { ...content }
                : content
        ));
    }

    useEffect(() => {
        fetchContent()
    }, []);

    useEffect(() => {
        setFormData(collection);
        setIsEditing(false);
    }, [collection]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-2xl overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-white">
                            {isEditing ? (
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-2 rounded w-full"
                                />
                            ) : (
                                formData.name
                            )}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="text-white text-2xl p-2 hover:bg-gray-800 rounded-full"
                            >
                                &times;
                            </button>
                        </div>
                    </div>

                    {isEditing ? (
                        <div>
                            <div className="mb-4">
                                <label className="block text-white text-sm mb-1">Slug</label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    disabled
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-gray-500 p-2 rounded disabled:bg-gray-950  w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-white text-sm mb-1">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-2 rounded w-full"
                                >
                                    <option value="hot">Hot</option>
                                    <option value="topic">Topic</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center text-white">
                                    <input
                                        type="checkbox"
                                        name="publish"
                                        checked={formData.publish}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Published
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="block text-white text-sm mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-2 rounded w-full"
                                    rows={3}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-300">
                            <p className="mb-2"><span className="font-semibold">Slug:</span> {formData.slug}</p>
                            <div className="mb-2"><span className="font-semibold">Type:</span>
                                <div className={`badge p-2 mx-2 font-bold badge-${collection.type === 'hot' ? 'primary' : 'secondary'}`}>
                                    {collection.type}
                                </div>
                            </div>
                            <p className="mb-2 flex gap-2"><span className="font-semibold">Status:</span> {formData.publish ? (
                                <span className="text-success flex flex-row gap-2">
                                    <span>Published</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </span>
                            ) : (
                                <span className="text-error flex flex-row gap-2">
                                    <span>Draft</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </span>
                            )}</p>
                            <p className="mb-2"><span className="font-semibold">Description:</span> {formData.description}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        {!isEditing && (
                            <button
                                onClick={() => setShowConfirmation(true)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white"
                                disabled={isLoading}
                            >
                                Delete Collection
                            </button>
                        )}
                        <button
                            onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-full text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : (isEditing ? 'Save' : 'Edit Collection')}
                        </button>
                        {isEditing && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-full text-white"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <div className="pt-4">
                        <div className="border-t h-2 w-full border-amber-500"></div>
                        <div className="flex flex-row justify-between">
                            <h3 className="text-xl mb-4">Contents</h3>
                            <AddCollectionContentModal collectionId={collection._id} onSuccess={handleNewContent} />
                        </div>

                        <section className="mb-8">
                            <div className="flex space-x-4 overflow-x-auto pb-4">
                                {contentList.map((content) => (
                                    <div
                                        key={content._id}
                                        className="w-44 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => {
                                            setSelectedContent(content);
                                            setShowUpdateModal(true);
                                        }}
                                    >
                                        <div
                                            className="h-64 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center"
                                            style={{ backgroundImage: `url(https://media.themoviedb.org/${content.bannerPath})` }}
                                        >
                                            {content.publish && (
                                                <div className="absolute top-2 right-2 badge badge-warning">
                                                    new
                                                </div>
                                            )}
                                            {content.type === "tvshow" && content.status === "updating" && (
                                                <div className="absolute bottom-2 left-2 badge badge-info">
                                                    updating
                                                </div>
                                            )}
                                        </div>

                                        <div className="font-medium text-sm">{content.title}</div>
                                        {content.year && <div className="text-xs text-gray-400">{content.year}</div>}
                                    </div>
                                ))}
                                {selectedContent && (
                                    <UpdateCollectionContentModel
                                        isOpen={showUpdateModal}
                                        onClose={() => setShowUpdateModal(false)}
                                        onSuccess={handleUpdateContent}
                                        onDelete={handleDeleteContent}
                                        content={selectedContent}
                                        collectionId={collection._id}
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4 text-white">Confirm Delete</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this collection?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            {isLoading && <FullPageLoader />}


        </div>
    );
};

export default CollectionModel;