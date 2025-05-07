import { useState } from 'react'
import { Media } from '../../types/media'
import { MediaService } from '../../services/media.service'
import { useNavigate } from 'react-router-dom'


export interface MediaCardAdminProps {
    media: Media
    onUpdate: (updatedMedia: Media) => void
    onDelete: (deletedMediaId: string) => void
}

const MediaCardAdmin = ({ media, onUpdate, onDelete }: MediaCardAdminProps) => {
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formData, setFormData] = useState({
        title: media.title,
        season: media.season,
        episode: media.episode,
        audioType: media.audioType
    })
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleUpdate = async () => {
        try {
            setIsUpdating(true)
            const response = await MediaService.updateMedia(media._id, formData)

            if (response.status !== "success") {
                // setError(response.error)
            } else {
                onUpdate(response.result)
                setShowEditModal(false)
            }
        } catch (err) {
            setError('Failed to update media')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const response = await MediaService.deleteMedia(media._id)

            if ('error' in response) {
                // setError(response.error)
            } else {
                onDelete(media._id)
                setShowDeleteModal(false)
            }
        } catch (err) {
            setError('Failed to delete media')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div
            onClick={() => {
                navigate(`/player/${media._id}`)
            }}
            key={media._id}
            className="border rounded-lg p-4 gap-4 flex items-center flex-row hover:shadow-lg hover:bg-gray-800 transition-shadow duration-200 hover:cursor-pointer"
        >
            <div
                className="w-36 h-24 bg-cover bg-center rounded flex-shrink-0"
                style={{ backgroundImage: `url()` }}
            >
                <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium truncate" title={media.title}>
                        {media.title}
                    </h4>
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded ml-2">
                        {media.audioType}
                    </span>
                </div>

                <div className="text-sm text-gray-600">
                    <p>Season: {media.season}</p>
                    <p>Episode: {media.episode}</p>
                    <p className="truncate" title={media.publicId}>
                        ID: {media.publicId}
                    </p>
                </div>
            </div>

            <div className="ml-auto flex gap-2">
                <button
                    onClick={() => setShowEditModal(true)}
                    className="btn btn-sm btn-ghost"
                >
                    Edit
                </button>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-sm btn-error"
                >
                    Delete
                </button>
            </div>

            {/* Edit Modal */}
            <dialog className={`modal ${showEditModal ? 'modal-open' : ''}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Edit Media</h3>

                    <div className="flex flex-col space-y-4">
                        <div className="form-control ">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4 ">
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text">Season</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={formData.season}
                                    onChange={(e) => setFormData({ ...formData, season: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text">Episode</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={formData.episode}
                                    onChange={(e) => setFormData({ ...formData, episode: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Audio Type</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={formData.audioType}
                                onChange={(e) => setFormData({ ...formData, audioType: e.target.value as Media['audioType'] })}
                            >
                                <option value="subtitle">Subtitle</option>
                                <option value="original">Original</option>
                                <option value="voiceover">Voiceover</option>
                            </select>
                        </div>

                        {error && (
                            <div className="alert alert-error mt-4">
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() => setShowEditModal(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Delete Confirmation Modal */}
            <dialog className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Delete</h3>
                    <p className="py-4">Are you sure you want to delete this media item?</p>

                    {error && (
                        <div className="alert alert-error mt-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-error"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default MediaCardAdmin