import { useState, useEffect } from "react";
import { Person } from "../../types/person";
import { CastService } from "@services/cast.service";
import PersonSearchBox from "../../components/search/PersonSearchBox";
import { Cast } from "../../types/cast";

interface AddCastModalProps {
    contentId: string;
    onSuccess: (cast: Cast) => void;
}

const AddCastModal = ({ contentId, onSuccess }: AddCastModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [role, setRole] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSelectedPerson(null);
            setRole('');
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPerson || !role.trim()) return;

        setIsLoading(true);
        try {
            const castsData = {
                personId: selectedPerson._id,
                character: role.trim(), 
                rank: 1
            };

            const response = await CastService.addCastToContent(
                contentId,
                [castsData]
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Cast member added successfully',
                    type: 'success'
                });
                onSuccess({
                    ...castsData,
                    contentId
                });
                setTimeout(() => {
                    setIsOpen(false);
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to add cast member',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while adding cast member',
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
                Add New Cast
            </button>

            <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
                <div className="modal-box relative h-1/2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </button>

                    <h3 className="text-xl font-bold mb-4">Add Cast Member</h3>
                    <div className="form-control">
                        <PersonSearchBox
                            onSelect={(person) => setSelectedPerson(person)}
                            className="mb-4"
                        />
                    </div>

                    {selectedPerson && (
                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Selected Person:</h4>
                            <div className="badge badge-primary badge-lg">
                                {selectedPerson.name}
                            </div>
                        </div>
                    )}

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter role (e.g., Actor, Director)"
                            className="input input-bordered w-full"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
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
                            disabled={!selectedPerson || !role.trim() || isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : 'Add Cast Member'}
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

export default AddCastModal;