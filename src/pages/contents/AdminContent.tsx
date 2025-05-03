import { useState, useEffect } from 'react';
import { FullPageLoader } from '@components/feedback/FullPageLoader';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { Toast } from '@components/feedback/Toast';
import MovieTab from './MovieTab';

interface EntityTab {
    id: string;
    label: string;
}

const AdminContent = () => {
    // State management
    const [activeEntity, setActiveEntity] = useState<string>('users');
    const [isLoading, setIsLoading] = useState(false);
    const [isFullPageLoading, setIsFullPageLoading] = useState(false);

    const entities: EntityTab[] = [
        { id: 'movie', label: 'Content Management' },
        { id: 'users', label: 'User Management' },
        { id: 'products', label: 'Product Catalog' },
        { id: 'orders', label: 'Order Tracking' }
    ];

    // Simulated API calls
    const simulateLoad = async (fullPage = false) => {
        if (fullPage) setIsFullPageLoading(true);
        else setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (fullPage) setIsFullPageLoading(false);
        else setIsLoading(false);
    };

    // Simulate initial data loading
    useEffect(() => {
        setIsFullPageLoading(true);
        simulateLoad(true);
    }, [activeEntity]);

    return (
        <div className="p-6 w-full">

            {/* Full Page Loader */}
            {isFullPageLoading && <FullPageLoader />}

            {/* Tab Navigation */}
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

                {/* Dynamic Content - Example for Users */}
                {activeEntity === 'movie' && (
                    <MovieTab />
                )}

                {/* Add similar blocks for other entities */}
            </div>
        </div>
    );
};

export default AdminContent;