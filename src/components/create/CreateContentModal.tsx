import { useState } from 'react';
import { Content } from '../../types/content';
import { ContentService } from '../../services/content.service';
import { FullPageLoader } from '@components/feedback/FullPageLoader';
import { Toast } from '@components/feedback/Toast';
import { slugify } from '../../utils/string.utils';

interface CreateContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContentCreated?: (content: Content) => void;
}

const CreateContentModal = ({ isOpen, onClose, onContentCreated }: CreateContentModalProps) => {
    const initialFormData: Omit<Content, '_id'> = {
        title: '',
        slug: '',
        thumbnailPath: '',
        bannerPath: '',
        overview: '',
        imdbRating: '',
        runtime: 0,
        releaseDate: '',
        year: new Date().getFullYear(),
        type: 'movie',
        status: 'finish',
        publish: false
    };

    const [formData, setFormData] = useState<Omit<Content, '_id'>>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [, setPreview] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? 0 : Number(value)
            }));
        } else {
            if (name === 'title') {
                // Automatically generate slug when title changes
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

            if (name === 'bannerPath') {
                setPreview(value);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await ContentService.createContent(formData);

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Content created successfully',
                    type: 'success'
                });
                setFormData(initialFormData);
                setPreview('');
                if (onContentCreated && response.result) {
                    onContentCreated(response.result);
                }
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to create content',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while creating content',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box bg-gray-900 max-w-3xl">
                <h3 className="font-bold text-lg mb-4">Create New Content</h3>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-800"
                                required
                            />
                        </div>

                        {/* Slug - automatically generated */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Slug</span>
                                <span className="label-text-alt text-gray-400">Auto-generated from title</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="input input-bordered  w-full bg-gray-800"
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
                                <option value="movie">Movie</option>
                                <option value="tvshow">TV Show</option>
                            </select>
                        </div>

                        {/* Thumbnail Path */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Thumbnail Path</span>
                            </label>
                            <input
                                type="text"
                                name="thumbnailPath"
                                value={formData.thumbnailPath}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-800"
                                required
                            />
                        </div>

                        {/* Banner Path */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Banner Path</span>
                            </label>
                            <input
                                type="text"
                                name="bannerPath"
                                value={formData.bannerPath}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-800"
                            />
                            {formData.bannerPath && (
                                <div className="aspect-square w-full bg-gray-800 rounded-lg overflow-hidden mt-2">
                                    <img
                                        src={`https://media.themoviedb.org/${formData.bannerPath}`}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* IMDB Rating */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">IMDB Rating</span>
                            </label>
                            <input
                                type="text"
                                name="imdbRating"
                                value={formData.imdbRating || ''}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-gray-800"
                            />
                        </div>

                        {/* Runtime  +  Year */}
                        <div className="form-control flex flex-row gap-4 w-full">
                            <div className='flex flex-row gap-4 w-1/2'>
                                <label className="label">
                                    <span className="label-text">Runtime (minutes)</span>
                                </label>
                                <input
                                    type="number"
                                    name="runtime"
                                    value={formData.runtime || ''}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-2/3 bg-gray-800"
                                />
                            </div>
                            <div className='flex flex-row gap-4 w-1/2'>
                                <label className="label">
                                    <span className="label-text">Year</span>
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year || ''}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-2/3 bg-gray-800"
                                />
                            </div>
                        </div>

                        {/* Release Date */}
                        <div className="form-control flex flex-row gap-4 w-full">
                            <div className='flex flex-row gap-4 w-1/2'>
                                <label className="label">
                                    <span className="label-text">Release Date</span>
                                </label>
                                <input
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate || ''}
                                    onChange={handleInputChange}
                                    className="input input-bordered bg-gray-800"
                                />
                            </div>
                            <div className='flex flex-row gap-4 w-1/2'>
                                <label className="label">
                                    <span className="label-text">Status</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status || 'finish'}
                                    onChange={handleInputChange}
                                    className="select select-bordered bg-gray-800 w-full"
                                >
                                    <option value="finish">Finish</option>
                                    <option value="updating">Updating</option>
                                </select>
                            </div>
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

                    {/* Overview */}
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Overview</span>
                        </label>
                        <textarea
                            name="overview"
                            value={formData.overview || ''}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered w-full bg-gray-800 h-24"
                        />
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
                            {isLoading ? 'Creating...' : 'Create Content'}
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

export default CreateContentModal;