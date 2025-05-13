import { useState, useEffect } from "react";
import { CastService } from "@services/cast.service";
import { Cast } from "../../types/cast";
import { LoadingSpinner } from "@components/feedback/LoadingSpinner";

interface UpdateCastModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (cast: Cast) => void;
    onDelete?: (personId: string) => void;
    cast: Cast;
    contentId: string;
}

const UpdateCastModal = ({
    isOpen,
    onClose,
    onSuccess,
    onDelete,
    cast,
    contentId
}: UpdateCastModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [character, setCharacter] = useState('');
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async (personId: string) => {
        setShowConfirm(false);
        try {
            setIsConfirmLoading(true);
            const response = await CastService.removeCastFromContent(contentId, [personId]);

            if (response.status === 'success') {
                setToast({ show: true, message: 'updateSuccess', type: 'success' });
                onDelete?.(personId)
            } else {
                setToast({ show: true, message: response.msg || 'deleteFailed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'deleteError', type: 'error' });
        } finally {
            setIsConfirmLoading(false);
            setShowConfirm(false);
        }
    };


    useEffect(() => {
        if (isOpen && cast) {
            setCharacter(cast.character || '');
        }
    }, [isOpen, cast]);

    useEffect(() => {
        if (!isOpen) {
            setCharacter('');
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]); const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!character.trim()) return;

        setIsLoading(true);
        try {
            const removeResponse = await CastService.removeCastFromContent(
                contentId,
                [cast.personId]
            );

            if (removeResponse.status !== 'success') {
                throw new Error(removeResponse.msg || 'Failed to update cast member');
            }

            const updatedCastData = {
                personId: cast.personId,
                character: character.trim(),
                rank: cast.rank || 1
            };

            const response = await CastService.addCastToContent(
                contentId,
                [updatedCastData]
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Cast member updated successfully',
                    type: 'success'
                });

                if (onSuccess) {
                    onSuccess({
                        ...updatedCastData,
                        contentId
                    });
                }

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to update cast member',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while updating cast member',
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

                <h3 className="text-xl font-bold mb-4">Update Cast Member</h3>

                {cast && (
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Cast Member:</h4>
                        <div className="badge badge-primary badge-lg">
                            {cast.personName || cast.personId}
                        </div>
                    </div>
                )}

                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Character Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter character name"
                        className="input input-bordered w-full"
                        value={character}
                        onChange={(e) => setCharacter(e.target.value)}
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
                            disabled={!character.trim() || isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : 'Delete Cast'}
                        </button>
                    </div>

                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={!character.trim() || isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : 'Update Cast Member'}
                        </button>
                    </div>
                </div>
                {showConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-bold mb-4">Confirm</h3>
                            <p className="text-gray-300 mb-6">Confirm delete this person: {cast.personName}?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setShowConfirm(false)
                                    }}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                    onClick={() => handleDelete(cast.personId)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'deleting' : 'confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default UpdateCastModal;