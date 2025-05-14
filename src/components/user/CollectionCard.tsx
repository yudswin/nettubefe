
import { useNavigate } from "react-router-dom";

interface CollectionCardProps {
    name: string,
    slug: string,
    className?: string;
}

const CollectionCard = ({
    name,
    slug,
    className = '',
}: CollectionCardProps) => {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate(`/collection/${slug}`)
    };

    return (
        <>
            <div
                className="w-44 flex-shrink-0 overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:rotate-6"
                onClick={handleNavigate}
            >
                <div className={`h-32 rounded-lg mb-2 bg-gray-800 flex items-center justify-center ${className}`}>
                    <span className="text-white font-medium px-2 text-center">{name}</span>
                </div>
            </div>
        </>
    );
};

export default CollectionCard;