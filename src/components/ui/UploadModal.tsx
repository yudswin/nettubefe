import { useState } from 'react';
import { MediaService } from '@services/media.service';

interface UploadModalProps {
    contentId: string;
    onSuccess: () => void;
}

export default function UploadModal({ contentId, onSuccess }: UploadModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        try {
            setIsUploading(true);
            const response = await MediaService.uploadMedia(contentId, file);

            if ('error' in response) {
                // setError(response.error);
            } else {
                onSuccess();
                setIsOpen(false);
                setFile(null);
            }
        } catch (err) {
            setError('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mb-4">
            <button
                className="btn  bg-amber-600 hover:bg-amber-700"
                onClick={() => setIsOpen(true)}
            >
                Upload Media
            </button>

            <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Upload Video</h3>

                    <div className="py-4">
                        <input
                            type="file"
                            className="file-input file-input-bordered w-full"
                            accept=".mp4"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />

                        {error && (
                            <div className="alert alert-error mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() => setIsOpen(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={isUploading || !file}
                        >
                            {isUploading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Uploading...
                                </>
                            ) : 'Confirm Upload'}
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
}