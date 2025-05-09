import Header from '@components/layout/Header'
import { Content } from '../types/content';
import { Media } from '../types/media';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { ContentService } from '@services/content.service';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import MediaCard from '@components/user/MediaCard';
import { MediaService } from '@services/media.service';
import Breadcrumb from '@components/layout/Breadcrumb';

const movie = () => {
    const { contentId } = useParams<{ contentId: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState<Content>();
    const [isMediaLoading, setIsMediaLoading] = useState(false);
    const [mediaList, setMediaList] = useState<Media[]>([]);

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

    useEffect(() => {
        fetchContent();
        fetchMedia();
    }, []);


    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div>
                    <Header toggleSidebar={() => (console.log())} sidebarOpen={false} />
                    {content ? (
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            {/* Banner Section */}
                            <div className="hero mb-8"  >
                                <div className="hero-overlay bg-opacity-60 rounded-lg"
                                    style={{
                                        backgroundImage: `url(https://media.themoviedb.org/${content.bannerPath || content.thumbnailPath})`,
                                        filter: 'blur(4px)',
                                        opacity: 0.5,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div className="hero-content justify-contnet flex-col lg:flex-row">
                                    <img
                                        src={`https://media.themoviedb.org/${content.bannerPath}`}
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

                                        {content.releaseDate && (
                                            <div className="text-neutral-content mb-4">
                                                Release Date:{" "}
                                                {new Date(content.releaseDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                                <div className="flex-1">
                                    <Breadcrumb currentPage={content?.title || 'Movie Detail'} />
                                    <h2 className="text-3xl font-bold mb-4">Overview</h2>
                                    <p className="text-neutral-content leading-relaxed">
                                        {content.overview || "No overview available."}
                                    </p>
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

                            {/* Media List */}
                            <div className="grid grid-cols-1 gap-4">
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