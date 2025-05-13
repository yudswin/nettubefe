import { useState } from 'react';
import { Collection } from '../../types/collection';
import { CollectionService } from '../../services/collection.service';
import { FullPageLoader } from '@components/feedback/FullPageLoader';
import { Toast } from '@components/feedback/Toast';
import { slugify } from '../../utils/string.utils';

interface CreateCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCollectionCreated?: (collection: Collection) => void;
}

const CreateCollectionModal = ({ isOpen, onClose, onCollectionCreated }: CreateCollectionModalProps) => {
    const initialFormData: Omit<Collection, '_id'> = {
        name: '',
        slug: '',
        description: '',
        type: 'topic',
        publish: false
    };

    const [formData, setFormData] = useState<Omit<Collection, '_id'>>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
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
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await CollectionService.createCollection(formData);

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Collection created successfully',
                    type: 'success'
                });
                setFormData(initialFormData);
                if (onCollectionCreated && response.result) {
                    onCollectionCreated(response.result);
                }
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to create collection',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while creating collection',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box bg-gray-900 max-w-3xl">
                <h3 className="font-bold text-lg mb-4">Create New Collection</h3>

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

                        {/* Type */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Type</span>
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="select select-bordered bg-gray-800 w-full"
                            >
                                <option value="topic">Topic</option>
                                <option value="hot">Hot</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered w-full bg-gray-800 h-24"
                            />
                        </div>

                        {/* Publish */}
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Publish</span>
                                <input
                                    type="checkbox"
                                    name="publish"
                                    checked={formData.publish}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        publish: e.target.checked
                                    }))}
                                    className="checkbox"
                                />
                            </label>
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
                            {isLoading ? 'Creating...' : 'Create Collection'}
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

export default CreateCollectionModal;