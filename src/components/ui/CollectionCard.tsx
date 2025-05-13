import { useState } from "react";
import { Collection } from "../../types/collection";
import CollectionModel from "./CollectionModel";

interface CollectionCardProps extends Collection {
    onDelete?: (deleteId: string) => void;
    onUpdate?: (updatedCollection: Collection) => void;
}

const CollectionCard = ({
    _id,
    name,
    slug,
    description,
    type,
    publish,
    onDelete,
    onUpdate
}: CollectionCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const handleUpdate = (updatedCollection: Collection) => {
        onUpdate?.(updatedCollection);
        handleCloseModal();
    };

    return (
        <>
            <div
                className="w-44 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                onClick={handleCardClick}
            >
                <div className="h-32 rounded-lg mb-2 bg-gray-800 flex items-center justify-center">
                    <span className="text-white font-medium px-2 text-center">{name}</span>
                </div>
            </div>

            <CollectionModel
                collection={{
                    _id,
                    name,
                    slug,
                    description,
                    type,
                    publish
                }}
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onDelete={onDelete}
                onUpdate={handleUpdate}
            />
        </>
    );
};

export default CollectionCard;