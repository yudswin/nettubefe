import { useLanguage } from "@contexts/LanguageContext";
import { Content } from "../../types/content";
import { useNavigate } from "react-router-dom";
import { History } from "@services/history.service";

interface ContentCardProps {
    content: Content
    history?: History
    onRemoveFromHistory?: (mediaId: string) => void
}

const ContentCard = ({ content, history, onRemoveFromHistory }: ContentCardProps) => {
    const { t } = useLanguage();
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/movie/${content._id}`)
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (history && onRemoveFromHistory) {
            onRemoveFromHistory(history.mediaId);
        }
    };

    const imageUrl = content.bannerPath
        ? content.bannerPath
        : "/defaultContent.png";

    return (
        <>
            <div
                className="w-44 flex-shrink-0 cursor-pointer transition-transform hover:scale-105 relative"
                onClick={handleCardClick}
            >
                {onRemoveFromHistory && (
                    <button
                        onClick={handleRemoveClick}
                        className="absolute top-2 left-2 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from history"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <div
                    className="h-64 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center group"
                    style={{ backgroundImage: `url(${imageUrl})` }}
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

                    {onRemoveFromHistory && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleRemoveClick}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                                title="Remove from history"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="font-medium text-sm">{content.title}</div>
                {content.year && <div className="text-xs text-gray-400">{content.year}</div>}
                {history &&
                    <div className="flex flex-col mt-1">
                        {content.type === "tvshow" && history.media && (
                            <div className="text-xs text-gray-400">
                                Season {history.media.season || 1}
                                {history.media.episode && `, Episode ${history.media.episode}`}
                            </div>
                        )}
                        {history.progress !== undefined && (
                            <div className="mt-1">
                                <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full"
                                        style={{ width: `${history.progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    {Math.round(history.progress)}% watched
                                </div>
                            </div>
                        )}
                    </div>
                }
            </div>
        </>
    );
};

export default ContentCard;