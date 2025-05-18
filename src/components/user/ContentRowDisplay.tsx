import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { Collection } from '../../types/collection';
import { useEffect, useState } from 'react';
import { Content } from "../../types/content";
import { Toast } from '@components/feedback/Toast';
import { CollectionService } from '@services/collection.service';

interface ContentRowDisplayProps {
    collection: Collection,
}


const ContentRowDisplay = ({ collection }: ContentRowDisplayProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contentList, setContentList] = useState<Content[]>([]);

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });


    const fetchContent = async () => {
        try {
            setIsLoading(true);
            const response = await CollectionService.getCollectionContentById(collection._id);

            if (response.status === 'success') {
                setContentList(response.result)
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load content',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContent()
    }, []);

    return (
        <div>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <section className='mb-8'>
                    <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
                        {(collection.type === 'hot') &&  (
                            <div></div>
                        )}
                    </div>
                </section>
            )}
        </div>
    )
}

export default ContentRowDisplay