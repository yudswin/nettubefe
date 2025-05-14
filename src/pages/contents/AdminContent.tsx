import { useState } from 'react';
import { FullPageLoader } from '@components/feedback/FullPageLoader';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import MovieTab from './MovieTab';
import PersonTab from './PersonTab';
import CategoryTab from './CategoryTab';
import CollectionTab from './CollectionTab';

export interface EntityTab {
    id: string;
    label: string;
}

const AdminContent = () => {
    // State management
    const [activeEntity, setActiveEntity] = useState<string>('movie');
    const [isLoading, setIsLoading] = useState(false);
    const [isFullPageLoading, setIsFullPageLoading] = useState(false);

    const entities: EntityTab[] = [
        { id: 'movie', label: 'Content Management' },
        { id: 'person', label: 'Person Management' },
        { id: 'category', label: 'Category Management' },
        { id: 'collection', label: 'Collection Management' }
    ];

    return (
        <div className="p-6 w-full">

            {isFullPageLoading && <FullPageLoader />}

            <div className="tabs tabs-boxed bg-base-200 p-2 rounded-lg">
                {entities.map((entity) => (
                    <button
                        key={entity.id}
                        className={`tab tab-lg ${activeEntity === entity.id ? 'tab-active' : ''}`}
                        onClick={() => setActiveEntity(entity.id)}
                    >
                        {entity.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="mt-6 bg-base-100 p-6 rounded-box shadow-lg relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center rounded-box">
                        <LoadingSpinner />
                    </div>
                )}
                {activeEntity === 'movie' && (
                    <MovieTab />
                )}
                {activeEntity === 'person' && (
                    <PersonTab />
                )}
                {activeEntity === 'category' && (
                    <CategoryTab />
                )}
                {activeEntity === 'collection' && (
                    <CollectionTab />
                )}
            </div>
        </div>
    );
};

export default AdminContent;