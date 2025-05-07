import { useState } from 'react';
import { Person } from '../../types/person';
import { PersonService } from '../../services/person.service';
import { FullPageLoader } from '@components/feedback/FullPageLoader';
import { Toast } from '@components/feedback/Toast';
import { slugify } from '../../utils/string.utils';

interface CreatePersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPersonCreated?: (person: Person) => void;
}

const CreatePersonModal = ({ isOpen, onClose, onPersonCreated }: CreatePersonModalProps) => {
    const initialFormData: Omit<Person, '_id'> = {
        name: '',
        slug: '',
        profilePath: ''
    };

    const [formData, setFormData] = useState<Omit<Person, '_id'>>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            // Automatically generate slug when name changes
            setFormData(prev => ({
                ...prev,
                [name]: value,
                slug: slugify(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await PersonService.createPerson(formData);

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Person created successfully',
                    type: 'success'
                });
                setFormData(initialFormData);
                if (onPersonCreated && response.result) {
                    onPersonCreated(response.result);
                }
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to create person',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while creating person',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box bg-gray-900 max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Create New Person</h3>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-800"
                                required
                            />
                        </div>

                        {/* Slug - automatically generated */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Slug</span>
                                <span className="label-text-alt text-gray-400">Auto-generated from name</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-800"
                                readOnly
                                disabled
                            />
                        </div>

                        {/* Profile Path */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Path</span>
                            </label>
                            <input
                                type="text"
                                name="profilePath"
                                value={formData.profilePath || ''}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-800"
                            />
                            {formData.profilePath && (
                                <div className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden mt-2">
                                    <img
                                        src={`https://media.themoviedb.org/${formData.profilePath}`}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-action mt-6">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 btn btn-ghost"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Person'}
                        </button>
                    </div>
                </form>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            {isLoading && <FullPageLoader />}
        </dialog>
    );
};

export default CreatePersonModal;