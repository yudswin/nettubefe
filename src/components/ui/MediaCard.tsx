import { useState } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import { Content } from '../../types/content';
import ContentModel from './ContentModel';
import MovieDetailModal from './MovieDetailModal';

interface MediaCardProps {
    content: Content;
    index?: number;
    type: "hot" | "topic" | "features"
}

const MediaCard = ({ content, index, type }: MediaCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { t } = useLanguage();



    const handleCardClick = () => {
        setModalOpen(true);
    };

    const handlePlay = () => {
        console.log(`Playing ${content.title}`);
        setModalOpen(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            {type === "hot" && (
                <div
                    className="w-66 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                    onClick={handleCardClick}
                >
                    <div
                        className="h-96 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center"
                        style={{ backgroundImage: `url(${content.bannerPath})` }}
                    >
                        {content.publish && (
                            <div className="absolute top-2 right-2 badge badge-warning">
                                {t.new}
                            </div>
                        )}
                        {content.type === "tvshow" && status === "updating" && (
                            <div className="absolute bottom-2 left-2 badge badge-info">
                                updating
                            </div>
                        )}
                    </div>

                    <div className="font-medium text-sm">{content.title}</div>
                    {content.year && <div className="text-xs text-gray-400">{content.year}</div>}
                </div>
            )}

            {type === "features" && (
                <div
                    className="w-64 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                    onClick={handleCardClick}
                >
                    <div
                        className="h-44 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center"
                        style={{ backgroundImage: `url(${content.bannerPath})` }}
                    >
                        {content.publish && (
                            <div className="absolute top-2 right-2 badge badge-warning">
                                {t.new}
                            </div>
                        )}
                        {content.type === "tvshow" && content.status === "updating" && (
                            <div className="absolute bottom-2 left-2 badge badge-info">
                                updating
                            </div>
                        )}
                    </div>


                    <div className='flex flex-row border-t-2 border-amber-300'>
                        <div className='pr-4 pt-2'>
                            <span className='text-5xl text-amber-300'>{index + 1}</span>
                        </div>
                        <div>
                            <div className="pt-2 font-medium text-sm">{content.title}</div>
                            {content.year && <div className="text-xs text-gray-400">{content.year}</div>}
                        </div>
                    </div>
                </div>
            )}

            {type === "topic" && (
                <div
                    className="w-96 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                    onClick={handleCardClick}
                >
                    <div
                        className="h-50 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center"
                        style={{ backgroundImage: `url(${content.bannerPath})` }}
                    >
                        <div className='w-full h-full absolute bg-radial/increasing from-gray-800/50 to-gray-900/50 rounded-lg'></div>
                        {content.publish && (
                            <div className="absolute top-2 right-2 badge badge-warning">
                                {t.new}
                            </div>
                        )}
                    </div>
                    <div className='flex flex-row'>
                        <div className='pr-4 pt-2 relative w-20 mx-2'>
                            <img
                                className={`absolute w-20 h-28 bottom-0 left-0`}
                                src={content.bannerPath} alt={content.title} />
                        </div>
                        <div>
                            <div className="pt-2 font-medium text-sm">{content.title}</div>
                            {content.year && <div className="text-xs text-gray-400">{content.year}</div>}
                        </div>
                    </div>
                </div>
            )}

            <MovieDetailModal
                contentId={content._id}
                isOpen={modalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default MediaCard;
