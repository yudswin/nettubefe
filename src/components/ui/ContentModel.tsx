import { useState, useEffect, useRef } from "react";
import { ContentService } from "@services/content.service";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { Content } from "../../types/content";
import { Media } from "../../types/media";
import { Cast } from "../../types/cast";
import { Director } from "../../types/director";
import { MediaService } from "@services/media.service";
import MediaCardAdmin from "./MediaCardAdmin";
import { LoadingSpinner } from "@components/feedback/LoadingSpinner";
import UploadModal from "./UploadModal";
import { CastService } from "@services/cast.service";
import AddCastModal from "@components/create/AddCastModal";
import { DirectorService } from "@services/director.service";
import AddDirectorModal from "@components/create/AddDirectorModal";
import UpdateCastModal from "@components/create/UpdateCastModal";

export interface ContentDetailModalProps {
    content: Content
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (deletedId: string) => void;
    onUpdate?: (updatedContent: Content) => void;
}

const ContentModel = ({ content, isOpen, onClose, onUpdate, onDelete }: ContentDetailModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState(content);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const [isMediaLoading, setIsMediaLoading] = useState(false);
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [castList, setCastList] = useState<Cast[]>([]);

    const [showBannerModal, setShowBannerModal] = useState(false);
    const [newBannerPath, setNewBannerPath] = useState("");
    const [previewBannerPath, setPreviewBannerPath] = useState("");

    const [isDirectorsLoading, setIsDirectorsLoading] = useState(false);
    const [directorList, setDirectorList] = useState<Director[]>([])
    const [showDirectorConfirm, setShowDirectorConfirm] = useState(false);    const [directorToDelete, setDirectorToDelete] = useState<Director>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCast, setSelectedCast] = useState<Cast | null>(null);



    const handleNewCast = (newCast: Cast) => {
        setCastList(prev => [...prev, newCast])
    }

    const fetchMedia = async () => {
        try {
            setIsMediaLoading(true)
            const response = await MediaService.getMediaList(content._id)
            if (response.status === 'success') {
                setMediaList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.data || 'Failed to load media',
                    type: 'error'
                })
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsMediaLoading(false);
        }
    }

    const fetchCast = async () => {
        try {
            setIsLoading(true)
            const response = await CastService.getAllCastByContent(content._id)
            if (response.status === 'success') {
                setCastList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.error || 'Failed to load casts',
                    type: 'error'
                })
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const fetchDirector = async () => {
        try {
            setIsDirectorsLoading(true)
            const response = await DirectorService.getAllDirectorByContent(content._id)
            if (response.status === 'success') {
                setDirectorList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.error || 'Failed to load director',
                    type: 'error'
                })
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsDirectorsLoading(false);
        }
    }

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleDialogClose = () => {
            if (isOpen) onClose();
        };

        dialog.addEventListener('close', handleDialogClose);

        return () => {
            dialog.removeEventListener('close', handleDialogClose);
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialogDimensions = dialogRef.current?.getBoundingClientRect();
        if (
            dialogDimensions &&
            (e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom)
        ) {
            onClose();
        }
    };


    useEffect(() => {
        if (isOpen == true) {
            fetchMedia();
            fetchCast();
            fetchDirector();
        }
    }, [isOpen]);


    useEffect(() => {
        setFormData(content);
        setIsEditing(false);
        setNewBannerPath(content.bannerPath || "");
        setPreviewBannerPath(content.bannerPath || "");
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
                fetchMedia();
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

    const handleUpdateBanner = async () => {
        try {
            setIsLoading(true);
            const updateData = {
                ...formData,
                bannerPath: newBannerPath
            };

            const response = await ContentService.updateContent(content._id, updateData);
            if (response.status === 'success') {
                setFormData(prev => ({ ...prev, bannerPath: newBannerPath }));
                onUpdate?.(updateData);
                setShowBannerModal(false);
                setToast({ show: true, message: 'Banner image updated', type: 'success' });
            } else {
                setToast({ show: true, message: response.msg || 'Update failed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Update error', type: 'error' });
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

    const handleDeleteCast = (deletedId: string) => {
        setCastList(prev => prev.filter(cast => cast.personId !== deletedId));
        setShowUpdateModal(false)
    };

    const handleDirectorDelete = async (personId?: string) => {
        setShowDirectorConfirm(false);
        try {
            setIsDirectorsLoading(true);
            if (personId) {
                const response = await DirectorService.removeDirectorFromContent(formData._id, [personId]);

                if (response.status === 'success') {
                    setToast({ show: true, message: 'updateSuccess', type: 'success' });
                    setDirectorList(prev => prev.filter(
                        director => director.personId !== personId
                    ));
                    setDirectorToDelete(undefined)
                } else {
                    setToast({ show: true, message: response.msg || 'deleteFailed', type: 'error' });
                }
            }
        } catch (error) {
            setToast({ show: true, message: 'deleteError', type: 'error' });
        } finally {
            setIsDirectorsLoading(false);
        }
    };    const handleNewDirector = (newDirector: Director) => {
        setDirectorList(prev => [...prev, newDirector])
    }

    const handleUpdateCast = (updatedCast: Cast) => {
        setCastList(prev => prev.map(cast => 
            cast.personId === updatedCast.personId 
                ? { ...cast, character: updatedCast.character } 
                : cast
        ));
    }

    const imageUrl = `https://media.themoviedb.org/${content.bannerPath}`

    if (!isOpen) return null; // Model state

    return (
        <dialog
            ref={dialogRef}
            className="modal  my-10"
            onClick={handleBackdropClick}
        >

            <div className="modal-box bg-gray-900 w-11/12 max-w-5xl  rounded-lg  focus:outline-none">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-100 px-4 btn btn-sm btn-circle btn-ghost focus:outline-none"
                >
                    ✕
                </button>
                <div className="bg-gray-900 rounded-lg w-full overflow-hidden">
                    <div className="relative">
                        <div
                            className="h-64 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${imageUrl})`,
                            }}
                        >
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
                                    <span className="flex items-center">
                                        <span>{formData.title}</span>
                                        <span className={`text-sm ${formData.type === "tvshow" ? " bg-amber-100 text-amber-800" : " bg-green-100 text-green-800"} px-2 py-1 rounded ml-2`}>
                                            {formData.type}
                                        </span>
                                    </span>
                                )}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'saving' : (isEditing ?
                                        <>
                                            <span>Save</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                            </svg>

                                        </>
                                        :
                                        <>
                                            <span>Edit Content</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </>)}
                                </button>
                                {!isEditing && (
                                    <button
                                        onClick={() => setShowConfirmation(true)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 btn"
                                        disabled={isLoading}
                                    >
                                        Delete Content
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>

                                    </button>
                                )}

                                {!isEditing && (
                                    <button
                                        onClick={() => setShowBannerModal(true)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 btn"
                                        disabled={isLoading}
                                    >
                                        Change Image
                                    </button>
                                )}
                            </div>
                        </div>

                        {showConfirmation && (
                            <dialog className={`modal ${showConfirmation ? 'modal-open' : ''}`}>
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Confirm Delete</h3>
                                    <p className="py-4">Are you sure you want to delete this content?</p>

                                    <div className="modal-action">
                                        <button
                                            className="btn"
                                            onClick={() => setShowConfirmation(false)}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-error"
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                                        </button>
                                    </div>
                                </div>
                            </dialog>
                        )}

                        <dialog className={`modal ${showBannerModal ? 'modal-open' : ''}`}>
                            <div className="modal-box bg-gray-900">
                                <h3 className="font-bold text-lg mb-4">Update Banner Image</h3>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Image URL</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newBannerPath}
                                        onChange={(e) => {
                                            setNewBannerPath(e.target.value);
                                            setPreviewBannerPath(e.target.value);
                                        }}
                                        placeholder="Enter image URL"
                                        className="input input-bordered bg-gray-800 text-white"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="label">
                                        <span className="label-text">Preview</span>
                                    </label>
                                    <div className="aspect-square w-full bg-gray-800 rounded-lg overflow-hidden">
                                        <img
                                            src={previewBannerPath}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="modal-action mt-6">
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setShowBannerModal(false)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleUpdateBanner}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </dialog>

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
                                <span className="flex items-center gap-2">
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
                                </span>
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
                        <div className="flex flex-wrap gap-2">
                            <h2 className="font-bold">Director:</h2>
                            {isDirectorsLoading && <LoadingSpinner />}
                            {directorList.map((director) => (
                                <div
                                    key={director.personId}
                                    className="badge badge-outline badge-primary gap-1 hover:bg-primary hover:text-primary-content transition-colors cursor-pointer group"
                                    onClick={() => {
                                        setShowDirectorConfirm(true);
                                        setDirectorToDelete(director);
                                    }}
                                >
                                    <span className="relative inline-block">
                                        <span className="group-hover:opacity-0 transition-opacity">
                                            {director.personName}
                                        </span>
                                        <span className="absolute left-0 top-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            Remove
                                        </span>
                                    </span>
                                </div>
                            ))}
                            <div
                                className="badge badge-primary gap-1 hover:bg-primary hover:text-primary-content transition-colors cursor-pointer"
                                onClick={() => {
                                    setShowCreateModal(true)
                                }}
                            >
                                <span>
                                    + New Director
                                </span>
                            </div>
                            <AddDirectorModal
                                isOpen={showCreateModal}
                                onClose={() => setShowCreateModal(false)}
                                onDirectorAdded={handleNewDirector}
                                contentId={content._id}
                            />
                        </div>

                        {showDirectorConfirm && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                                <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
                                    <h3 className="text-lg font-bold mb-4">Confirm</h3>
                                    <p className="text-gray-300 mb-6">Confirm delete this director: {directorToDelete?.personName}?</p>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => {
                                                setShowDirectorConfirm(false)
                                                setDirectorToDelete(undefined)
                                            }}
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                            onClick={() => handleDirectorDelete(directorToDelete?.personId)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'deleting' : 'confirm'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <div className="border-t h-2 w-full border-amber-500"></div>
                            <div className="flex flex-row justify-between">
                                <h3 className="text-xl mb-4">Casts</h3>
                                <AddCastModal contentId={formData._id} onSuccess={handleNewCast} />
                            </div>
                            <div className="carousel carousel-center space-x-4 pb-2">                                
                                {castList.map(cast => (
                                    <div key={cast.personId} className="carousel-item w-24 hover:cursor-pointer"
                                        onClick={() => {
                                            setSelectedCast(cast);
                                            setShowUpdateModal(true);
                                        }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="avatar mb-2 group"
                                            >
                                                <div className="w-24 h-24 rounded-full">
                                                    <img src={cast.profilePath} alt={cast.character} />
                                                </div>
                                                <div className="absolute rounded-full hover:bg-amber-200/50 w-24 h-24 group">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8 opacity-0 absolute group-hover:opacity-100 transition-opacity top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-center text-sm font-medium">{cast.personName}</p>
                                            <p className="text-center text-xs text-gray-400">{cast.character}</p>
                                        </div>
                                    </div>
                                ))}
                                {selectedCast && (
                                    <UpdateCastModal
                                        isOpen={showUpdateModal}
                                        onClose={() => {
                                            setShowUpdateModal(false);
                                            setSelectedCast(null);
                                        }}
                                        contentId={content._id}
                                        onSuccess={handleUpdateCast}
                                        onDelete={handleDeleteCast}
                                        cast={selectedCast}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="pt-4">
                            <div className="border-t h-2 w-full border-amber-500"></div>
                            <div className="flex flex-row justify-between">
                                <h3 className="text-xl mb-4">Media</h3>
                                <UploadModal contentId={formData._id} onSuccess={() => fetchMedia()} />
                            </div>
                            <div className="flex-col gap-4 flex ">
                                {isMediaLoading && <LoadingSpinner />}                                {mediaList.map((media) => (
                                    <MediaCardAdmin
                                        key={media._id}
                                        media={media}
                                        onUpdate={() => {
                                            fetchMedia();
                                        }}
                                        onDelete={() => {
                                            fetchMedia();
                                        }}
                                    />
                                ))}
                            </div>
                            {mediaList.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No media files found
                                </div>
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
        </dialog >
    );
};

export default ContentModel;