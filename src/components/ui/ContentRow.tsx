import { useEffect, useState } from 'react';
import MediaCard from './MediaCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { Collection } from '../../types/collection';
import { Content } from '../../types/content';
import { CollectionService } from '@services/collection.service';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface ContentRowProps {
    collection: Collection;
}

const ContentRow = ({ collection }: ContentRowProps) => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contents, setContents] = useState<Content[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetchContentsByCollection();
    }, [collection._id]);

    const fetchContentsByCollection = async () => {
        if (!collection || !collection._id) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await CollectionService.getCollectionContentById(collection._id);
            if (response.status === 'success') {
                setContents(response.result);
            } else {
                setError(response.msg || 'Failed to load contents');
            }
        } catch (error) {
            setError('Failed to connect to server');
            console.error('Error fetching contents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{collection.name}</h2>
                <button className="hover:cursor-pointer md:flex hidden mt-2 text-gray-400 hover:text-amber-300 transition-colors ease-in-out delay-75 gap-2 items-center"
                onClick={() => navigate(`/collection/${collection.slug}`)}
                >
                    <span>{t.viewAll}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {isLoading && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && !error && contents.length > 0 && (
                <div className="flex gap-10 overflow-x-auto px-8 py-4">
                    {contents.map((content, index) => (
                        <MediaCard
                            key={content._id}
                            content={content}
                            index={index}
                            type={collection.type}
                        />
                    ))}
                </div>
            )}

            {!isLoading && !error && contents.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    No content available in this collection.
                </div>
            )}
        </section>
    );
};

export default ContentRow;