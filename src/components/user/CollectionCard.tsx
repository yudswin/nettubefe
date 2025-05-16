
import { useNavigate } from "react-router-dom";

interface CollectionCardProps {
    name: string,
    slug: string,
    className?: string;
    index: number
}

const CollectionCard = ({
    name,
    slug,
    className = '',
    index
}: CollectionCardProps) => {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate(`/collection/${slug}`)
    };

    return (
        <>
            <div
                className={`w-66 flex-shrink-0 overflow-hidden cursor-pointer transition-all hover:scale-105 hover:${(index % 2) == 0 ? "rotate-6" : "-rotate-6"} group`}
                onClick={handleNavigate}
            >
                <div className={`h-48 rounded-2xl mb-2 flex-col bg-gray-800 hover:bg-white/50 hover:border-1 border-white transition-colors ease-linear delay-75  flex items-center justify-center ${className}`}>
                    <div className="text-white text-xl font-medium px-2 text-center">{name}</div>
                    <div className={`transition-all ease-in-out delay-75 hidden ${index != undefined ? "group-hover:flex" : ""}`}>Check it out!</div>
                </div>
            </div>
        </>
    );
};

export default CollectionCard;