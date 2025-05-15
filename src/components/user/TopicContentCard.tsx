import { useLanguage } from "@contexts/LanguageContext";
import { Content } from "../../types/content";
import { useNavigate } from "react-router-dom";

interface TopicContentCardProps {
    content: Partial<Content>
    slug?: string
}

const TopicContentCard = ({ content, slug }: TopicContentCardProps) => {
    const { t } = useLanguage();
    const navigate = useNavigate()

    const handleCardClick = () => {
        if (content._id != undefined) {
            navigate(`/movie/${content._id}`)
        } else {
            navigate(`/movie/${content.contentId}`)
        }
    };

    const imageUrl = content.bannerPath
        ? content.bannerPath
        : "/public/defaultContent.png";

    return (
        <>
            <div
                className="w-64 flex-shrink-0 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-900 rounded-md pb-4"
                onClick={handleCardClick}
            >
                <div
                    className="h-44 rounded-md mb-2 bg-gray-800 relative bg-cover bg-center"
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
                </div>
                <div className="px-2">
                    <div className="font-medium text-sm">{content.title}</div>
                {content.year && <div className="text-xs text-gray-400">{content.year}</div>}
                </div>
            </div>
        </>
    );
};

export default TopicContentCard;