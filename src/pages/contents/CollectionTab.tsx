import { FullPageLoader } from '@components/feedback/FullPageLoader';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { Toast } from '@components/feedback/Toast';
import { useState } from 'react'

const CollectionTab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
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
            <h2 className="text-2xl font-bold mb-6">Collection Library</h2>

            <div className="mt-6 bg-base-100 p-6 rounded-box shadow-lg relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center rounded-box">
                        <LoadingSpinner />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CollectionTab