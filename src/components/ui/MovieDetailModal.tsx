import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Content } from '../../types/content';
import { Cast } from '../../types/cast';
import { Genre } from '../../types/genre';
import { Country } from '../../types/country';
import { Director } from '../../types/director';
import { ContentService } from '@services/content.service';
import { CastService } from '@services/cast.service';
import { GenreService } from '@services/genre.service';
import { CountryService } from '@services/country.service';
import { DirectorService } from '@services/director.service';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { FavoriteService } from '@services/favorite.service';

interface MovieDetailModalProps {
    contentId: string;
    isOpen: boolean;
    onClose: () => void;
}

const MovieDetailModal = ({ contentId, isOpen, onClose }: MovieDetailModalProps) => {
    const { t } = useLanguage();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState<Content | null>(null);
    const [castList, setCastList] = useState<Cast[]>([]);
    const [directorList, setDirectorList] = useState<Director[]>([]);
    const [genreList, setGenreList] = useState<Genre[]>([]);
    const [countryList, setCountryList] = useState<Country[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Separate error states for different data types
    const [contentError, setContentError] = useState<string | null>(null);
    const [metadataErrors, setMetadataErrors] = useState<string[]>([]);

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
        if (isOpen) {
            setContentError(null);
            setMetadataErrors([]);
            setCastList([]);
            setDirectorList([]);
            setGenreList([]);
            setCountryList([]);
        }
    }, [isOpen]);

    // Fetch content details when modal opens and contentId is available
    useEffect(() => {
        if (isOpen && contentId) {
            fetchContent();
            fetchCast();
            fetchDirector();
            fetchGenre();
            fetchCountry();
            checkFavoriteStatus();
        }
    }, [isOpen, contentId]);

    useEffect(() => {
        if (isOpen && contentId && user) {
            checkFavoriteStatus();
        }
    }, [isOpen, contentId, user]);

    const checkFavoriteStatus = async () => {
        if (!user || !contentId) return;

        try {
            setIsFavoriteLoading(true);
            const response = await FavoriteService.getFavorite(user._id, contentId);
            setIsFavorite('data' in response && !!response.data);
        } catch (error) {
            console.error("Error checking favorite status:", error);
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!user || !contentId) {
            console.log("User must be logged in to favorite content");
            return;
        }

        setIsFavoriteLoading(true);

        try {
            if (isFavorite) {
                await FavoriteService.deleteFavorite(user._id, contentId);
                setIsFavorite(false);
            } else {
                await FavoriteService.createFavorite({
                    userId: user._id,
                    contentId: contentId
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const fetchContent = async () => {
        try {
            setIsLoading(true);
            const response = await ContentService.getContentById(contentId);
            if (response.status === 'success') {
                setContent(response.result);
            } else {
                setContentError(response.msg || 'Failed to load content');
            }
        } catch (error) {
            setContentError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCast = async () => {
        try {
            const response = await CastService.getAllCastByContent(contentId);
            if (response.status === 'success') {
                setCastList(response.result || []);
            } else {
                setMetadataErrors(prev => [...prev, 'Failed to load casts']);
            }
        } catch (error) {
            console.error('Failed to fetch cast:', error);
            // Just log the error, don't block rendering
        }
    };

    const fetchDirector = async () => {
        try {
            const response = await DirectorService.getAllDirectorByContent(contentId);
            if (response.status === 'success') {
                setDirectorList(response.result || []);
            } else {
                setMetadataErrors(prev => [...prev, 'Failed to load directors']);
            }
        } catch (error) {
            console.error('Failed to fetch directors:', error);
        }
    };

    const fetchGenre = async () => {
        try {
            const response = await GenreService.getGenresByContent(contentId);
            if (response.status === 'success') {
                setGenreList(response.result || []);
            } else {
                setMetadataErrors(prev => [...prev, 'Failed to load genres']);
            }
        } catch (error) {
            console.error('Failed to fetch genres:', error);
        }
    };

    const fetchCountry = async () => {
        try {
            const response = await CountryService.getCountriesByContent(contentId);
            if (response.status === 'success') {
                setCountryList(response.result || []);
            } else {
                setMetadataErrors(prev => [...prev, 'Failed to load countries']);
            }
        } catch (error) {
            console.error('Failed to fetch countries:', error);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="modal"
            onClick={handleBackdropClick}
        >
            <div className="modal-box bg-gray-900 w-11/12 max-w-5xl p-0 rounded-lg">
                {isLoading && <LoadingSpinner />}

                {contentError && (
                    <div className="alert alert-error m-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{contentError}</span>
                    </div>
                )}

                {!isLoading && !contentError && content && (
                    <>
                        {/* Cover section */}
                        <div
                            className="h-72 bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${content.bannerPath || '/default-banner.jpg'})` }}
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
                            {/* Display metadata fetch errors if any */}
                            {metadataErrors.length > 0 && (
                                <div className="alert alert-warning mb-4 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Some content details could not be loaded</span>
                                </div>
                            )}

                            {/* Title and play button */}
                            <div className="flex flex-wrap items-start justify-between mb-4">
                                <div className="mb-4 md:mb-0">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-1">
                                        {content.title || t.unknownTitle}
                                        {content.year && (
                                            <span className="ml-2 text-neutral-content text-3xl">
                                                ({content.year})
                                            </span>
                                        )}
                                    </h2>
                                    <div className="flex items-center text-sm text-gray-400 flex-wrap gap-2 mb-2">
                                        {content.imdbRating && (
                                            <div className="badge badge-warning gap-1">
                                                <span>★</span> {content.imdbRating}/10
                                            </div>
                                        )}
                                        {content.runtime && (
                                            <div className="badge badge-info">
                                                {Math.floor(content.runtime / 60)}h {content.runtime % 60}min
                                            </div>
                                        )}
                                        {content.status && (
                                            <div className="badge badge-secondary">
                                                {content.status}
                                            </div>
                                        )}
                                        {content.type && (
                                            <div className="badge badge-primary">
                                                {content.type.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleToggleFavorite}
                                        disabled={isFavoriteLoading}
                                        className={`btn ${isFavorite ? 'btn-error' : 'btn-outline'} border-none`}
                                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        {isFavoriteLoading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : isFavorite ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/movie/${content._id}`)}
                                        className="btn btn-primary bg-amber-500 hover:bg-amber-600 border-none"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        {t.play}
                                    </button>
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="font-bold">{t.genres}: </span>
                                {genreList.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {genreList.map((genre) => (
                                            <div
                                                key={genre._id}
                                                className="badge bg-amber-500/50 border-0 text-white"
                                            >
                                                {genre.englishName}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">{t.notAvailable}</span>
                                )}
                            </div>

                            {/* Country info */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="font-bold">{t.country}: </span>
                                {countryList.length > 0 ? (
                                    <div>
                                        {countryList.map((country, index) => (
                                            <span key={country._id}>
                                                {country.name} {country.code && `(${country.code})`}
                                                {index < countryList.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">{t.notAvailable}</span>
                                )}
                            </div>

                            {/* Release date */}
                            <div className="mb-4">
                                <span className="font-bold">{t.releaseDate}: </span>
                                {content.releaseDate ? (
                                    new Date(content.releaseDate).toLocaleDateString()
                                ) : (
                                    <span className="text-gray-400">{t.notAvailable}</span>
                                )}
                            </div>

                            {/* Directors */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="font-bold">{t.director}: </span>
                                {directorList.length > 0 ? (
                                    <div>
                                        {directorList.map((director, index) => (
                                            <span key={director.personId}>
                                                {director.personName}
                                                {index < directorList.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">{t.notAvailable}</span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{t.overview}</h3>
                                <p className="text-gray-300">
                                    {content.overview || t.noOverviewAvailable}
                                </p>
                            </div>

                            {/* Cast section */}
                            {castList.length > 0 ? (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-3">{t.cast}</h3>
                                    <div className="carousel carousel-center space-x-4 pb-2">
                                        {castList.map(person => (
                                            <div key={person.personId} className="carousel-item w-24 hover:cursor-pointer"
                                                onClick={() => navigate(`/person/${person.personId}`)}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="avatar mb-2">
                                                        <div className="w-24 h-24 rounded-full">
                                                            <img
                                                                src={person.profilePath ? `https://media.themoviedb.org/${person.profilePath}` : '/defaultProfile.jpg'}
                                                                alt={person.character}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/default-avatar.jpg';
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-center text-sm font-medium">{person.personName}</p>
                                                    <p className="text-center text-xs text-gray-400">{person.character}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-2">{t.cast}</h3>
                                    <p className="text-gray-400">{t.noCastAvailable}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
};

export default MovieDetailModal;