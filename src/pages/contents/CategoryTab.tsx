import { FullPageLoader } from '@components/feedback/FullPageLoader';
import { Toast } from '@components/feedback/Toast';
import { useState } from 'react'
import { EntityTab } from './AdminContent';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import GenreTab from './GenreTab';
import CountryTab from './CountryTab';
import DepartmentTab from './DepartmentTab';

const CategoryTab = () => {
    const [activeEntity, setActiveEntity] = useState<string>('genre');
    const [isLoading, ] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const entities: EntityTab[] = [
        { id: 'genre', label: 'Genres' },
        { id: 'country', label: 'Countries' },
        { id: 'department', label: 'Departments' },
    ];


    return (
        <div>
            {isLoading && <FullPageLoader />}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}
            <h2 className="text-2xl font-bold mb-6">Categories Library</h2>
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
            <div className="mt-6 bg-base-100 p-6 rounded-box shadow-lg relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center rounded-box">
                        <LoadingSpinner />
                    </div>
                )}

                {/* Dynamic Content - Example for Users */}
                {activeEntity === 'genre' && (
                    <GenreTab />
                )}

                {activeEntity === 'country' && (
                    <CountryTab />
                )}

                {activeEntity === 'department' && (
                    <DepartmentTab />
                )}

            </div>
        </div>
    )
}


export default CategoryTab