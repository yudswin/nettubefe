import { useState, useEffect } from "react";
import { CastService } from "@services/cast.service";
import { Cast } from "../../types/cast";

interface UpdateCastModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (cast: Cast) => void;
    cast: Cast;
    contentId: string;
}

const UpdateCastModal = ({
    isOpen,
    onClose,
    onSuccess,
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
    }, [isOpen]);    const handleSubmit = async (e: React.FormEvent) => {
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
        </dialog>
    );
};

export default UpdateCastModal;