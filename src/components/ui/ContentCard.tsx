import { useState } from "react";
import { useLanguage } from "@contexts/LanguageContext";
import ContentModel from "./ContentModel";
import { Content } from "../../types/content";

interface ContentCardProps extends Content {
    onDelete?: (deletedId: string) => void;
    onUpdate?: (updatedPerson: Content) => void;
}

const ContentCard = ({
    _id,
    title,
    overview,
    thumbnailPath,
    bannerPath,
    type,
    publish,
    status,
    year,
    onUpdate,
    onDelete
}: ContentCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { t } = useLanguage();

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const imageUrl = bannerPath
        ? `https://media.themoviedb.org/${bannerPath}`
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
                    {publish && (
                        <div className="absolute top-2 right-2 badge badge-warning">
                            {t.new}
                        </div>
                    )}
                    {type === "tvshow" && status === "updating" && (
                        <div className="absolute bottom-2 left-2 badge badge-info">
                            updating
                        </div>
                    )}
                </div>

                <div className="font-medium text-sm">{title}</div>
                {year && <div className="text-xs text-gray-400">{year}</div>}
            </div>

            <ContentModel
                content={{
                    _id,
                    title,
                    overview,
                    thumbnailPath,
                    bannerPath,
                    type,
                    publish,
                    status,
                    year,
                }}
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </>
    );
};

export default ContentCard;