import { useState, useEffect } from "react";
// import { useLanguage } from "@contexts/LanguageContext";
import { ContentService } from "@services/content.service";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { Content } from "../../types/content";

export interface ContentDetailModalProps {
    content: {
        _id: string;
        title: string;
        thumbnailPath: string;
        bannerPath?: string;
        overview?: string;
        imdbRating?: string;
        runtime?: number;
        year?: number;
        type: "movie" | "tvshow";
        status?: "finish" | "updating";
        publish: boolean;
    };
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (deletedId: string) => void;
    onUpdate?: (updatedContent: Content) => void;
}

const ContentModel = ({ content, isOpen, onClose, onUpdate, onDelete }: ContentDetailModalProps) => {
    // const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState(content);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        setFormData(content);
        setIsEditing(false);
    }, [content]);

    const formatRuntime = (minutes: number | undefined) => {
        if (!minutes) return "";
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' || name === 'runtime' ? Number(value) : value
        }));
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const response = await ContentService.updateContent(formData._id, formData);

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
            const response = await ContentService.deleteContent(formData._id);

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
                            backgroundImage: `url(${formData.bannerPath || formData.thumbnailPath})`,
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
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-2 rounded w-full"
                                />
                            ) : (
                                formData.title
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

                    <div className="flex gap-4 text-sm text-gray-400 mb-4 flex-wrap">
                        {isEditing ? (
                            <>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-1 rounded w-20"
                                    placeholder="Year"
                                />
                                <input
                                    type="number"
                                    name="runtime"
                                    value={formData.runtime || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-1 rounded w-28"
                                    placeholder="Runtime (mins)"
                                />
                                <input
                                    type="text"
                                    name="imdbRating"
                                    value={formData.imdbRating || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-1 rounded w-24"
                                    placeholder="IMDB Rating"
                                />
                                <select
                                    name="status"
                                    value={formData.status || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-1 rounded"
                                >
                                    <option value="finish">finished</option>
                                    <option value="updating">updating</option>
                                </select>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="publish"
                                        checked={formData.publish}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            publish: e.target.checked
                                        }))}
                                        className="checkbox checkbox-sm"
                                    />
                                    published
                                </label>
                            </>
                        ) : (
                            <>
                                {formData.year && <span>{formData.year}</span>}
                                {formData.runtime && (
                                    <span>{formatRuntime(formData.runtime)}</span>
                                )}
                                {formData.imdbRating && (
                                    <span>IMDB: {formData.imdbRating}</span>
                                )}
                                {formData.status === "updating" && (
                                    <span className="text-amber-500">updating</span>
                                )}
                                <span className={`badge ${formData.publish ? 'badge-success' : 'badge-error'}`}>
                                    {formData.publish ? 'published' : 'unpublished'}
                                </span>
                            </>
                        )}
                    </div>

                    {isEditing ? (
                        <textarea
                            name="overview"
                            value={formData.overview || ''}
                            onChange={handleInputChange}
                            className="bg-gray-800 text-white p-2 rounded w-full mb-4"
                            rows={4}
                            placeholder="overviewPlaceholder"
                        />
                    ) : (
                        formData.overview && (
                            <p className="text-gray-300 mb-4">{formData.overview}</p>
                        )
                    )}

                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-full">
                            play
                        </button>
                        {formData.type === "tvshow" && (
                            <button className="px-6 py-2 border border-gray-600 hover:border-gray-400 rounded-full">
                                seasons
                            </button>
                        )}
                    </div>
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

export default ContentModel;