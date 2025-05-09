import { useState, useEffect } from "react";
import { Department } from "../../types/department";
import { PersonDepartmentService } from "@services/junction/personDepartment.service";
import DeptSearchBox from "@components/search/DeptSearchBox";

interface AddDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDepartmentAdded?: (department: Department) => void;
    personId: string;
}

const AddDepartmentModal = ({
    isOpen,
    onClose,
    onDepartmentAdded,
    personId
}: AddDepartmentModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedDepartment(null);
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDepartment) return;

        setIsLoading(true);
        try {
            const response = await PersonDepartmentService.addDepartmentsToPerson(
                personId,
                [selectedDepartment._id]
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Department added successfully',
                    type: 'success'
                });

                if (onDepartmentAdded) {
                    onDepartmentAdded(selectedDepartment);
                }

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to add department',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while adding department',
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

                <h3 className="text-xl font-bold mb-4">Add Department</h3>

                <div className="form-control">
                    <DeptSearchBox
                        onSelect={(department) => setSelectedDepartment(department)}
                        className="mb-4"
                    />
                </div>

                {selectedDepartment && (
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Selected Department:</h4>
                        <div className="badge badge-primary badge-lg">
                            {selectedDepartment.name}
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
                        disabled={!selectedDepartment || isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : 'Add Department'}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default AddDepartmentModal;