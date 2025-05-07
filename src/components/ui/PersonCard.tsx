import { useState } from "react";
import { Person } from "../../types/person";
import PersonModel from "./PersonModel";

interface PersonCardProps extends Person {
    onDelete?: (deleteId: string) => void;
    onUpdate?: (updatedPerson: Person) => void;
}

const PersonCard = ({
    _id,
    name,
    slug,
    profilePath,
    onDelete,
    onUpdate
}: PersonCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const handleUpdate = (updatedPerson: Person) => {
        onUpdate?.(updatedPerson);
        handleCloseModal();
    };

    const imageUrl = profilePath 
        ? `https://media.themoviedb.org/${profilePath}`
        : "/defaultProfile.jpg";

    return (
        <>
            <div
                className="w-44 flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                onClick={handleCardClick}
            >
                <div
                    className="h-64 rounded-full mb-2 bg-gray-800 relative bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                </div>
                <div className="font-medium text-sm">{name}</div>
            </div>

            <PersonModel
                person={{
                    _id,
                    slug,
                    name,
                    profilePath
                }}
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onDelete={onDelete}
                onUpdate={handleUpdate}
            />
        </>

    )
}

export default PersonCard;