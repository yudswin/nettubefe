import { useState, useEffect } from "react";
import { Content } from "../../types/content";
import { CollectionService } from "@services/collection.service";
import ContentSearchBox from "../search/ContentSearchBox";

interface AddCollectionContentModalProps {
    collectionId: string;
    onSuccess: (content: Content) => void;
}

const AddCollectionContentModal = ({ collectionId, onSuccess }: AddCollectionContentModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedContent(null);
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContent) return;

        setIsLoading(true);
        try {
            const response = await CollectionService.addContentToCollection(
                collectionId,
                selectedContent._id
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Content added to collection successfully',
                    type: 'success'
                });
                onSuccess(selectedContent);
                setTimeout(() => {
                    setIsOpen(false);
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to add content to collection',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while adding content to collection',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <button
                className="btn bg-amber-600 hover:bg-amber-700"
                onClick={() => setIsOpen(true)}
            >
                Add Content
            </button>

            <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
                <div className="modal-box relative h-1/2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </button>

                    <h3 className="text-xl font-bold mb-4">Add Content to Collection</h3>
                    <div className="form-control">
                        <ContentSearchBox
                            onSelect={(content) => setSelectedContent(content)}
                            className="mb-4"
                        />
                    </div>

                    {selectedContent && (
                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Selected Content:</h4>
                            <div className="badge badge-primary badge-lg">
                                {selectedContent.title}
                            </div>
                        </div>
                    )}

                    {toast.show && (
                        <div className={`alert alert-${toast.type} mt-4`}>
                            <span>{toast.message}</span>
                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={!selectedContent || isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : 'Add to Collection'}
                        </button>
                    </div>
                </div>

                {/* Click outside to close */}
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setIsOpen(false)}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default AddCollectionContentModal;