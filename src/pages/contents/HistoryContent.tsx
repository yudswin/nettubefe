import { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import ContentCard from '@components/user/ContentCard';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { Toast } from '@components/feedback/Toast';
import { HistoryService, History } from '../../services/history.service';

const HistoryContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [historyList, setHistoryList] = useState<History[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const fetchUserHistory = async () => {
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
            const response = await HistoryService.getUserHistory(user._id);
            if (response.status === 'success') {
                setHistoryList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.error || 'Failed to fetch history',
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

    const handleRemoveFromHistory = async (mediaId: string) => {
        if (!user?._id) return;

        setIsDeleting(mediaId);
        try {
            const response = await HistoryService.deleteHistory(user._id, mediaId);

            if (response.status === 'success') {
                setHistoryList(prev => prev.filter(item => item.mediaId !== mediaId));
                setToast({
                    show: true,
                    message: 'Item removed from history',
                    type: 'success'
                });
            } else {
                setToast({
                    show: true,
                    message: response.error || 'Failed to remove from history',
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
        fetchUserHistory();
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
                    <h2 className="text-xl font-bold">Watch History</h2>
                </div>
                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="p-8 bg-gradient-to-b from-[#272b3a] to-gray-900 rounded-2xl">
                        <div className="flex flex-wrap gap-6">
                            {historyList.length > 0 ? (
                                historyList.map(item => (
                                    <ContentCard
                                        key={`${item.userId}-${item.mediaId}`}
                                        content={item.content}
                                        history={item}
                                        onRemoveFromHistory={handleRemoveFromHistory}
                                    />
                                ))
                            ) : (
                                <div className="w-full p-8 text-gray-400 text-center">
                                    No watch history available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default HistoryContent;