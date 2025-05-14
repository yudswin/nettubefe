import { useState } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import MovieDetailModal from './MovieDetailModal';
import { Movie } from '../../types/media';
import { Content } from '../../types/content';

interface MediaCardProps {
    id: number;
    title: string;
    image: string;
    progress?: number;
    added?: string;
    type: 'continue' | 'recent';
    movieData?: Movie; 
    contentData?: Content;
}

const MediaCard = ({ id, title, image, progress, added, type, movieData }: MediaCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { t } = useLanguage();

    // Sample movie data if no real data provided
    const defaultMovieData: Movie = {
        id,
        title,
        image,
        coverImage: image,
        description: "No description available",
        year: "2023",
        duration: "1h 30m",
        rating: "PG-13",
        progress,
        added,
        cast: [
            { id: 1, name: "Actor 1", character: "Character 1", image: "/placeholder_actor.jpg" },
            { id: 2, name: "Actor 2", character: "Character 2", image: "/placeholder_actor.jpg" }
        ],
        episodes: type === 'continue' ? [
            { id: 1, title: "Episode 1", number: 1, image: "/placeholder_episode.jpg", duration: "45m" },
            { id: 2, title: "Episode 2", number: 2, image: "/placeholder_episode.jpg", duration: "42m" },
            { id: 3, title: "Episode 1", number: 3, image: "/placeholder_episode.jpg", duration: "45m" },
            { id: 4, title: "Episode 1", number: 4, image: "/placeholder_episode.jpg", duration: "45m" },
            { id: 5, title: "Episode 1", number: 5, image: "/placeholder_episode.jpg", duration: "45m" },
            { id: 6, title: "Episode 1", number: 6, image: "/placeholder_episode.jpg", duration: "45m" },
        ] : undefined
    };

    const movie = movieData || defaultMovieData;

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const handlePlay = () => {
        console.log(`Playing ${title}`);
        setModalOpen(false);
        // Navigation to video player would go here
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div
                className="w-44 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                onClick={handleCardClick}
            >
                <div
                    className="h-64 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                >
                    {type === 'continue' && progress && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                            <div className="h-full bg-amber-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}

                    {type === 'recent' && (
                        <div className="absolute top-2 right-2 badge badge-warning">{t.new}</div>
                    )}
                </div>

                <div className="font-medium text-sm">{title}</div>
                {type === 'recent' && added && (
                    <div className="text-xs text-gray-400">{added}</div>
                )}
            </div>

            <MovieDetailModal
                movie={movie}
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onPlay={handlePlay}
            />
        </>
    );
};

export default MediaCard;
