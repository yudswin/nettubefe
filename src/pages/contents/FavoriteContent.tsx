import { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import ContentCard from '@components/user/ContentCard';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { Toast } from '@components/feedback/Toast';
import { FavoriteService, Favorite } from '../../services/favorite.service';

const FavoriteContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [favoriteList, setFavoriteList] = useState<Favorite[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const fetchUserFavorites = async () => {
        if (!user?._id) {
            setToast({
                show: true,
                message: 'User not authenticated',
                type: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await FavoriteService.getUserFavorites(user._id);
            if (response.status === 'success') {
                setFavoriteList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.error || 'Failed to fetch favorites',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFromFavorites = async (contentId: string) => {
        if (!user?._id) return;

        setIsDeleting(contentId);
        try {
            const response = await FavoriteService.deleteFavorite(user._id, contentId);

            if (response.status === 'success') {
                setFavoriteList(prev => prev.filter(item => item.contentId !== contentId));
                setToast({
                    show: true,
                    message: 'Item removed from favorites',
                    type: 'success'
                });
            } else {
                setToast({
                    show: true,
                    message: response.error || 'Failed to remove from favorites',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
            console.error(error);
        } finally {
            setIsDeleting(null);
        }
    };

    useEffect(() => {
        fetchUserFavorites();
    }, [user?._id]);

    return (
        <div className="p-4 md:p-8">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Favorites</h2>
                </div>
                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="p-8 bg-gradient-to-b from-[#272b3a] to-gray-900 rounded-2xl">
                        <div className="flex flex-wrap gap-6">
                            {favoriteList.length > 0 ? (
                                favoriteList.map(item => (
                                    <ContentCard
                                        key={`${item.userId}-${item.contentId}`}
                                        content={item.content}
                                    />
                                ))
                            ) : (
                                <div className="w-full p-8 text-gray-400 text-center">
                                    No favorites available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default FavoriteContent;