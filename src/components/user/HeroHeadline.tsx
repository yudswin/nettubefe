import { useNavigate } from 'react-router-dom';
import { Collection } from '../../types/collection';
import { Content } from '../../types/content';
import { useState, useEffect } from 'react';

interface HeroHeadlineProps {
    collection?: Collection,
    contentList: Content[],
}

const HeroHeadline = ({ contentList }: HeroHeadlineProps) => {
    const [activeItem, setActiveItem] = useState(1);
    const [autoPlay] = useState(true);
    const navigate = useNavigate()
    const autoPlayInterval = 5000;
    const totalItems = 4;

    useEffect(() => {
        let interval: any;
        if (autoPlay) {
            interval = setInterval(() => {
                setActiveItem(prevItem => prevItem < totalItems ? prevItem + 1 : 1);
            }, autoPlayInterval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoPlay]);

    const handleManualNavigation = (itemNumber: number) => {
        setActiveItem(itemNumber);
    };

    return (
        <section className='mb-8 rounded-lg h-48 md:h-162 flex items-center px-6 md:px-8 relative'>
            <div className="carousel w-full">
                {contentList.map((content, index) => (
                    <div key={content._id || index} className={`carousel-item w-full ${activeItem === (index + 1) ? 'block' : 'hidden'}`}>
                        <div
                            style={{ backgroundImage: `url(${content.bannerPath})` }}
                            className="w-full rounded-lg h-48 md:h-162 bg-cover bg-center relative" >
                            <div className='w-full h-full absolute bg-radial/longer from-gray-800/50 to-gray-900/50 rounded-lg'></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute xl:flex hidden bottom-6 right-10 items-end gap-2 py-2 hover:cursor-pointer">
                {contentList.map((content, index) => (
                    <button key={content._id || index} onClick={() => handleManualNavigation(index + 1)} className={`mx-2 ${activeItem === (index + 1) ? '' : ''}`}>
                        <div
                            className={`bg-cover bg-center rounded-md mb-2 bg-gray-800 transition-all ${activeItem === (index + 1) ? 'h-64 w-44 border border-white shadow-2xl' : 'h-32 w-22 '}`}
                            style={{ backgroundImage: `url(${content.bannerPath})` }} >
                        </div>
                    </button>
                ))}
            </div>
            <div className="absolute bottom-6 left-10 justify-center gap-2 py-2 ">
                {contentList.map((content, index) => (
                    <div key={content._id || index} className="contents">
                        <div className={`lg:ml-8 transition-all ${activeItem === (index + 1) ? 'md:animate-[bounce_5s_ease-in-out] scale-100 md:scale-105' : 'hidden'}`}>
                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-4 line-clamp-2 md:line-clamp-none">
                                {content.title}
                                {content.year && (
                                    <span className="ml-1 md:ml-2 text-neutral-content text-xl md:text-2xl lg:text-3xl">
                                        ({content.year})
                                    </span>
                                )}
                            </h1>
                            <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-4">
                                {content.imdbRating && (
                                    <div className="badge badge-warning gap-1 md:gap-2 text-xs md:text-sm">
                                        <span>★</span> {content.imdbRating}/10
                                    </div>
                                )}
                                {content.runtime && (
                                    <div className="badge badge-info text-xs md:text-sm">
                                        {Math.floor(content.runtime / 60)}h {content.runtime % 60}min
                                    </div>
                                )}
                                {content.status && (
                                    <div className="badge badge-secondary text-xs md:text-sm">
                                        {content.status}
                                    </div>
                                )}
                                {content.type && (
                                    <div className="badge badge-primary text-xs md:text-sm">
                                        {content.type.toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Release date - hide on very small screens */}
                            {content.releaseDate && (
                                <div className="hidden sm:block mb-2 md:mb-4 text-sm md:text-base">
                                    <span className='font-bold'>Release Date:{" "} </span>
                                    {new Date(content.releaseDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        <button className={`${activeItem === (index + 1) ? 'flex items-center mt-4 gap-3 group' : 'hidden'}`}
                            onClick={() => navigate(`/movie/${content._id}`)}
                        >
                            <div
                                className={`btn bg-amber-400 border-none rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 p-2 sm:p-3 md:p-4 lg:ml-8`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
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
                            </div>
                            <div className='group-hover:cursor-pointer font-black text-amber-200'>Watch Now</div>
                        </button>
                    </div>
                ))}
            </div>
        </section >
    )
}

export default HeroHeadline