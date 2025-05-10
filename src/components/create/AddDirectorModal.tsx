import { useState, useEffect } from "react";
import { Director } from "../../types/director";
import { DirectorService } from "@services/director.service";
import DirectorSearchBox from "../search/DirectorSearchBox";
import { Person } from "../../types/person";

interface AddDirectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDirectorAdded?: (director: Director) => void;
    contentId: string;
}

const AddDirectorModal = ({
    isOpen,
    onClose,
    onDirectorAdded,
    contentId
}: AddDirectorModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedPerson(null);
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPerson) return;

        setIsLoading(true);
        try {
            const director: Omit<Director, 'contentId'> = {
                personId: selectedPerson._id,
                personName: selectedPerson.name || '',
                rank: 1
            };

            const response = await DirectorService.addDirectorToContent(
                contentId,
                [director]
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Director added successfully',
                    type: 'success'
                });

                if (onDirectorAdded && response.result) {
                    onDirectorAdded(response.result);
                }

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to add director',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while adding director',
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

                <h3 className="text-xl font-bold mb-4">Add Director</h3>

                <div className="form-control">
                    <DirectorSearchBox
                        onSelect={(person) => setSelectedPerson(person)}
                        className="mb-4"
                    />
                </div>

                {selectedPerson && (                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Selected Director:</h4>
                        <div className="badge badge-primary badge-lg">
                            {selectedPerson.name || selectedPerson._id}
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
                        disabled={!selectedPerson || isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : 'Add Director'}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default AddDirectorModal;