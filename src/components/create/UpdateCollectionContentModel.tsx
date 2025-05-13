import { useState, useEffect } from "react";
import { CollectionService } from "@services/collection.service";
import { Content } from "../../types/content";
import { LoadingSpinner } from "@components/feedback/LoadingSpinner";

interface UpdateCollectionContentModelProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (content: Content) => void;
    onDelete?: (contentId: string) => void;
    content: Content;
    collectionId: string;
}

const UpdateCollectionContentModel = ({
    isOpen,
    onClose,
    onSuccess,
    onDelete,
    content,
    collectionId
}: UpdateCollectionContentModelProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [rank, setRank] = useState(1);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (isOpen && content) {
            setRank(content.rank || 1);
        }
    }, [isOpen, content]);

    useEffect(() => {
        if (!isOpen) {
            setRank(1);
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]);

    const handleDelete = async (contentId: string) => {
        setShowConfirm(false);
        try {
            setIsConfirmLoading(true);
            const response = await CollectionService.removeContentFromCollection(collectionId, contentId);

            if (response.status === 'success') {
                setToast({ show: true, message: 'Content removed successfully', type: 'success' });
                onDelete?.(contentId);
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({ show: true, message: response.msg || 'Failed to remove content', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Error removing content', type: 'error' });
        } finally {
            setIsConfirmLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await CollectionService.updateContentRankInCollection(
                collectionId,
                content._id,
                rank
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Content rank updated successfully',
                    type: 'success'
                });

                if (onSuccess && content._id) {
                    const updatedContent: Content = {
                        _id: content._id,
                        title: content.title || '',
                        slug: content.slug || '',
                        thumbnailPath: content.thumbnailPath || '',
                        bannerPath: content.bannerPath || '',
                        overview: content.overview || '',
                        imdbRating: content.imdbRating || '',
                        runtime: content.runtime || 0,
                        type: content.type || 'movie',
                        publish: content.publish || false,
                        rank,
                        status: content.status,
                        year: content.year
                    };
                    onSuccess(updatedContent);
                }

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to update content rank',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while updating content rank',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            {isConfirmLoading && <LoadingSpinner />}
            <div className="modal-box relative h-1/2">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                >
                    ✕
                </button>
                <h3 className="text-xl font-bold mb-4">Update Collection Content</h3>
                {content && (
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Content:</h4>
                        <div className="badge badge-primary badge-lg">
                            {content.title || content._id}
                        </div>
                    </div>
                )}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Rank</span>
                    </label>
                    <input
                        type="number"
                        placeholder="Enter rank"
                        className="input input-bordered w-full"
                        value={rank}
                        min={1}
                        onChange={(e) => setRank(parseInt(e.target.value) || 1)}
                    />
                </div>
                {toast.show && (
                    <div className={`alert alert-${toast.type} mt-4`}>
                        <span>{toast.message}</span>
                    </div>
                )}
                <div className="flex flex-row justify-between">
                    <div className="modal-action">
                        <button
                            className="btn btn-error"
                            onClick={() => setShowConfirm(true)}
                            disabled={isLoading || isConfirmLoading}
                        >
                            Remove Content
                        </button>
                    </div>
                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={isLoading || isConfirmLoading}
                        >
                            Update Rank
                        </button>
                    </div>
                </div>
                {showConfirm && content._id && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-bold mb-4">Confirm</h3>
                            <p className="text-gray-300 mb-6">
                                Confirm remove this content: {content.title || content._id}?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                                    disabled={isConfirmLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                    onClick={() => content._id && handleDelete(content._id)}
                                    disabled={isConfirmLoading}
                                >
                                    {isConfirmLoading ? 'removing' : 'confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default UpdateCollectionContentModel;