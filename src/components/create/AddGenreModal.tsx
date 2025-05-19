import { useState, useEffect } from "react";
import { Genre } from "../../types/genre";
import { GenreService } from "@services/genre.service";
import GenreSearchBox from "../search/GenreSearchBox";

interface AddGenreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenreAdded?: (genre: Genre) => void;
    contentId: string;
}

const AddGenreModal = ({
    isOpen,
    onClose,
    onGenreAdded,
    contentId
}: AddGenreModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedGenre(null);
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGenre) return;

        setIsLoading(true);
        try {
            const response = await GenreService.addGenreToContent(
                contentId,
                [selectedGenre._id]
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Genre added successfully',
                    type: 'success'
                });

                if (onGenreAdded) {
                    onGenreAdded(selectedGenre);
                }

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to add genre',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while adding genre',
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

                <h3 className="text-xl font-bold mb-4">Add Genre</h3>

                <div className="form-control">
                    <GenreSearchBox
                        onSelect={(genre) => setSelectedGenre(genre)}
                        className="mb-4"
                    />
                </div>

                {selectedGenre && (
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Selected Genre:</h4>
                        <div className="badge badge-primary badge-lg">
                            {selectedGenre.name || selectedGenre._id}
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
                        disabled={!selectedGenre || isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : 'Add Genre'}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default AddGenreModal;