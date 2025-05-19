import Header from '@components/layout/Header'
import { Content } from '../types/content';
import { Media } from '../types/media';
import { Cast } from '../types/cast';
import { Genre } from '../types/genre';
import { Country } from '../types/country';
import { Director } from '../types/director';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { ContentService } from '@services/content.service';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import MediaCard from '@components/user/MediaCard';
import { MediaService } from '@services/media.service';
import Breadcrumb from '@components/layout/Breadcrumb';
import { CastService } from '@services/cast.service';
import { GenreService } from '@services/genre.service';
import { CountryService } from '@services/country.service';
import { DirectorService } from '@services/director.service';
import { FavoriteService } from '@services/favorite.service';
import { useAuth } from '@contexts/AuthContext';

const movie = () => {
    const { contentId } = useParams<{ contentId: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState<Content>();
    const [isMediaLoading, setIsMediaLoading] = useState(false);
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [castList, setCastList] = useState<Cast[]>([]);
    const [directorList, setDirectorList] = useState<Director[]>([]);
    const [genreList, setGenreList] = useState<Genre[]>([]);
    const [countryList, setCountryList] = useState<Country[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const { user } = useAuth();

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const fetchContent = async () => {
        try {
            setIsLoading(true)
            if (contentId) {
                const response = await ContentService.getContentById(contentId)
                if (response.status === 'success') {
                    setContent(response.result)
                } else {
                    setToast({
                        show: true,
                        message: response.msg || 'Failed to load content',
                        type: 'error'
                    });
                }
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

    const fetchMedia = async () => {
        try {
            setIsMediaLoading(true)
            if (contentId) {
                const response = await MediaService.getMediaList(contentId)
                if (response.status === 'success') {
                    setMediaList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.data || 'Failed to load media',
                        type: 'error'
                    })
                }
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

    const checkFavoriteStatus = async () => {
        if (!user || !contentId) return;

        try {
            setIsFavoriteLoading(true);
            const response = await FavoriteService.getFavorite(user._id, contentId);
            setIsFavorite(response.status === 'success' && !!response.result);
        } catch (error) {
            console.error("Error checking favorite status:", error);
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const fetchCast = async () => {
        try {
            setIsLoading(true)
            if (contentId) {
                const response = await CastService.getAllCastByContent(contentId)
                if (response.status === 'success') {
                    setCastList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.error || 'Failed to load casts',
                        type: 'error'
                    })
                }
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
            setIsLoading(true)
            if (contentId) {
                const response = await DirectorService.getAllDirectorByContent(contentId)
                if (response.status === 'success') {
                    setDirectorList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.error || 'Failed to load casts',
                        type: 'error'
                    })
                }
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

    const fetchGenre = async () => {
        try {
            setIsLoading(true)
            if (contentId) {
                const response = await GenreService.getGenresByContent(contentId)
                if (response.status === 'success') {
                    setGenreList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.error || 'Failed to load casts',
                        type: 'error'
                    })
                }
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

    const fetchCountry = async () => {
        try {
            setIsLoading(true)
            if (contentId) {
                const response = await CountryService.getCountriesByContent(contentId)
                if (response.status === 'success') {
                    setCountryList(response.result);
                } else {
                    setToast({
                        show: true,
                        message: response.error || 'Failed to load countries',
                        type: 'error'
                    })
                }
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

    const handleToggleFavorite = async () => {
        if (!user || !contentId) {
            setToast({
                show: true,
                message: 'You must be logged in to favorite content',
                type: 'error'
            });
            return;
        }

        setIsFavoriteLoading(true);

        try {
            if (isFavorite) {
                const response = await FavoriteService.deleteFavorite(user._id, contentId);
                if (response.status === 'success') {
                    setIsFavorite(false);
                    setToast({
                        show: true,
                        message: 'Removed from favorites',
                        type: 'success'
                    });
                }
            } else {
                const response = await FavoriteService.createFavorite({
                    userId: user._id,
                    contentId: contentId
                });
                if (response.status === 'success') {
                    setIsFavorite(true);
                    setToast({
                        show: true,
                        message: 'Added to favorites',
                        type: 'success'
                    });
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            setToast({
                show: true,
                message: 'Failed to update favorites',
                type: 'error'
            });
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    useEffect(() => {
        if (user && contentId) {
            checkFavoriteStatus();
        }
    }, [user, contentId]);

    useEffect(() => {
        fetchContent();
        fetchMedia();
        fetchCast();
        fetchDirector();
        fetchGenre();
        fetchCountry();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div>
                    <Header toggleSidebar={() => (console.log())} sidebarOpen={false} />
                    {content ? (
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="hero mb-8"  >
                                <div className="hero-overlay bg-opacity-60 rounded-lg"
                                    style={{
                                        backgroundImage: `url(${content.bannerPath})`,
                                        filter: 'blur(4px)',
                                        opacity: 0.5,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div className="hero-content justify-contnet flex-col lg:flex-row">
                                    <img
                                        src={`${content.bannerPath}`}
                                        className="max-w-sm rounded-lg shadow-2xl"
                                        alt={content.title}
                                    />
                                    <div className="lg:ml-8">
                                        <h1 className="text-5xl font-bold mb-4">
                                            {content.title}
                                            {content.year && (
                                                <span className="ml-2 text-neutral-content text-3xl">
                                                    ({content.year})
                                                </span>
                                            )}
                                        </h1>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {content.imdbRating && (
                                                <div className="badge badge-warning gap-2">
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
                                        <button
                                            onClick={handleToggleFavorite}
                                            disabled={isFavoriteLoading}
                                            className={`btn btn-sm my-2 ${isFavorite ? 'btn-error' : 'btn-outline'} gap-1`}
                                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                        >
                                            {isFavoriteLoading ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : isFavorite ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    Favorited
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    Favorite
                                                </>
                                            )}
                                        </button>
                                        <div className='flex flex-wrap gap-2 mb-2'>
                                            <span className='font-bold'>Country: </span>
                                            {countryList.map((country) => (
                                                <div
                                                    key={country._id}
                                                    className="badge bg-blue-500/50 border-0 hover:bg-primary hover:text-primary-content transition-colors hover:cursor-pointer"
                                                    onClick={() => navigate(`/browse?countrySlugs=${country.slug}`)}
                                                >
                                                    <span className="opacity-100">
                                                        {country.name} ({country.code})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        {content.releaseDate && (
                                            <div className="mb-4">
                                                <span className='font-bold'>Release Date:{" "} </span>
                                                {new Date(content.releaseDate).toLocaleDateString()}
                                            </div>
                                        )}
                                        {isLoading && <LoadingSpinner />}
                                        <div className='flex flex-wrap gap-2 mb-4'>
                                            <span className='font-bold'>Genres:{" "} </span>
                                            {genreList.map((genre) => (
                                                <div
                                                    key={genre._id}
                                                    className="badge bg-amber-500/50 border-0 hover:bg-primary hover:text-primary-content transition-colors hover:cursor-pointer"
                                                    onClick={() => navigate(`/browse?genreSlugs=${genre.slug}`)}
                                                >
                                                    <span className="opacity-100">
                                                        {genre.englishName}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='flex flex-wrap gap-2 mb-4'>
                                            <span className='font-bold'>Director:{" "} </span>
                                            {directorList.map((director) => (
                                                <div key={director.personId} onClick={() => navigate(`/person/${director.personId}`)}>
                                                    <span className="opacity-100 hover:underline hover:cursor-pointer">
                                                        {director.personName}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                                <div className="flex-1">
                                    <div>
                                        <Breadcrumb currentPage={content?.title || 'Movie Detail'} />
                                        <div className="border-b h-2 border-amber-500 w-full"></div>
                                    </div>
                                    <div className='flex md:flex-row flex-col gap-4 pt-4'>
                                        <div className='w-1/2'>
                                            <h3 className="text-xl font-bold mb-4">Overview</h3>
                                            <p className="text-neutral-content leading-relaxed">
                                                {content.overview || "No overview available."}
                                            </p>
                                        </div>
                                        <div className='w-1/2'>
                                            <h3 className="text-xl font-bold mb-4">Casts</h3>
                                            <div className="carousel carousel-center space-x-4 pb-2">
                                                {castList.map(cast => (
                                                    <div key={cast.personId} className="carousel-item w-24 hover:cursor-pointer"
                                                        onClick={() => navigate(`/person/${cast.personId}`)}
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className="avatar mb-2"
                                                            >
                                                                <div className="w-24 h-24 rounded-full">
                                                                    <img src={`https://media.themoviedb.org/${cast.profilePath}`} alt={cast.character} />
                                                                </div>
                                                            </div>
                                                            <p className="text-center text-sm font-medium">{cast.personName}</p>
                                                            <p className="text-center text-xs text-gray-400">{cast.character}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-80">
                                    <button
                                        className="btn btn-primary w-full"
                                        onClick={() => navigate(`/player/${mediaList[0]._id}`)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Watch Now
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <h3 className="text-xl font-bold mb-4">Media</h3>
                                {isMediaLoading && <LoadingSpinner />}
                                {mediaList.map((media) => (
                                    <MediaCard
                                        key={media._id}
                                        media={media}
                                        contentType={content.type}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-error max-w-7xl mx-auto my-8">
                            <div className="flex-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <label>Content not found</label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default movie