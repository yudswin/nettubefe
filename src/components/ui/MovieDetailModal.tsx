import { useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Movie } from '../../types/media';

interface MovieDetailModalProps {
    movie: Movie;
    isOpen: boolean;
    onClose: () => void;
    onPlay: () => void;
}

const MovieDetailModal = ({ movie, isOpen, onClose, onPlay }: MovieDetailModalProps) => {
    const { t } = useLanguage();
    const dialogRef = useRef<HTMLDialogElement>(null);

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

    // Handle click outside the modal
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

    return (
        <dialog
            ref={dialogRef}
            className="modal "
            onClick={handleBackdropClick}
        >
            <div className="modal-box bg-gray-900 w-11/12 max-w-5xl p-0 rounded-lg">
                {/* Cover section */}
                <div
                    className="h-72 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${movie.coverImage || movie.image})` }}
                >
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                        aria-label={t.close}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 h-24"></div>
                </div>

                {/* Content section */}
                <div className="p-6">
                    {/* Title and play button */}
                    <div className="flex flex-wrap items-start justify-between mb-4">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl md:text-3xl font-bold mb-1">{movie.title}</h2>
                            <div className="flex items-center text-sm text-gray-400">
                                <span>{movie.year}</span>
                                <span className="mx-2">•</span>
                                <span>{movie.duration}</span>
                                <span className="mx-2">•</span>
                                <span>{movie.rating}</span>
                            </div>
                        </div>
                        <button
                            onClick={onPlay}
                            className="btn btn-primary bg-amber-500 hover:bg-amber-600 border-none"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {t.play}
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-6">{movie.description}</p>

                    {/* Cast section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-3">{t.cast}</h3>
                        <div className="carousel carousel-center space-x-4 pb-2">
                            {movie.cast.map(person => (
                                <div key={person.id} className="carousel-item w-24">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="avatar mb-2"
                                        >
                                            <div className="w-24 h-24 rounded-full">
                                                <img src={person.image} alt={person.name} />
                                            </div>
                                        </div>
                                        <p className="text-center text-sm font-medium">{person.name}</p>
                                        <p className="text-center text-xs text-gray-400">{person.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Episodes section (for TV Shows) */}
                    {movie.episodes && movie.episodes.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-3">{t.episodes}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {movie.episodes.map(episode => (
                                    <div
                                        key={episode.id}
                                        className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors"
                                        onClick={() => onPlay()}
                                    >
                                        <div
                                            className="w-24 h-16 bg-cover bg-center rounded mr-3 flex-shrink-0"
                                            style={{ backgroundImage: `url(${episode.image})` }}
                                        >
                                            <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{episode.number}. {episode.title}</div>
                                            <div className="text-sm text-gray-400">{episode.duration}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </dialog>
    );
};

export default MovieDetailModal;
