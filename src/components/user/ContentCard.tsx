import { useLanguage } from "@contexts/LanguageContext";
import { Content } from "../../types/content";
import { useNavigate } from "react-router-dom";

interface ContentCardProps {
    content: Content
}

const ContentCard = ({ content }: ContentCardProps) => {
    const { t } = useLanguage();
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/movie/${content._id}`)
    };

    const imageUrl = content.bannerPath
        ? `https://media.themoviedb.org/${content.bannerPath}`
        : "/defaultContent.png";

    return (
        <>
            <div
                className="w-44 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                onClick={handleCardClick}
            >
                <div
                    className="h-64 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
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
        </>
    );
};

export default ContentCard;