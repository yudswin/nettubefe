import { useState, useEffect } from "react";
import { PersonService } from "@services/person.service";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { Person } from "../../types/person";

export interface PersonDetailModelProps {
    person: {
        _id: string;
        name: string;
        slug: string;
        profilePath?: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (deletedId: string) => void;
    onUpdate?: (updatedPerson: Person) => void;
}

const PersonModel = ({ person, isOpen, onClose, onUpdate, onDelete }: PersonDetailModelProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState(person);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        setFormData(person);
        setIsEditing(false);
    }, [person]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const response = await PersonService.updatePerson(formData._id, formData);

            if (response.status === 'success') {
                setToast({ show: true, message: 'updateSuccess', type: 'success' });
                onUpdate?.(formData);
                setIsEditing(false);
            } else {
                setToast({ show: true, message: response.msg || 'updateFailed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'updateError', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setShowConfirmation(false);
        try {
            setIsLoading(true);
            const response = await PersonService.deletePerson(formData._id);

            if (response.status === 'success') {
                setToast({ show: true, message: 'deleteSuccess', type: 'success' });
                onClose();
                onDelete?.(formData._id);
            } else {
                setToast({ show: true, message: response.msg || 'deleteFailed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'deleteError', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-2xl overflow-hidden">
                <div className="relative">
                    <div
                        className="h-64 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://media.themoviedb.org/${person.profilePath || "/default-profile.jpg"})`,
                        }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-white text-2xl p-2 hover:bg-gray-800 rounded-full"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">
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
                            {!isEditing && (
                                <button
                                    onClick={() => setShowConfirmation(true)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full"
                                    disabled={isLoading}
                                >
                                    delete
                                </button>
                            )}
                            <button
                                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'saving' : (isEditing ? 'save' : 'edit')}
                            </button>
                        </div>
                    </div>

                    {showConfirmation && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
                                <h3 className="text-lg font-bold mb-4">confirmDelete</h3>
                                <p className="text-gray-300 mb-6">deleteConfirmationText</p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'deleting' : 'confirm'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <input
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="bg-gray-800 text-white p-2 rounded w-full mb-4"
                            placeholder="Slug"
                        />
                    ) : (
                        <p className="text-gray-400 mb-4">{formData.slug}</p>
                    )}
                </div>
            </div>

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

export default PersonModel;
