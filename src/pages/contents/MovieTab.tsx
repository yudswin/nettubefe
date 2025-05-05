import { useState, useEffect } from "react";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { ContentService } from "@services/content.service";
import ContentCard from "@components/ui/ContentCard";
import { Content } from "../../types/content";

const MediaTab = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [contentList, setContentList] = useState<Content[]>([]);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const handleContentDelete = (deletedId: string) => {
        setContentList(prev => prev.filter(content => content._id !== deletedId));
    };

    const fetchContent = async () => {
        try {
            setIsLoading(true);
            const response = await ContentService.getContentList();

            if (response.status === 'success') {
                setContentList(response.result);
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
        fetchContent();
    }, []);

    return (
        <div className="p-4">
            {isLoading && <FullPageLoader />}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            <h2 className="text-2xl font-bold mb-6">Content Library</h2>

            <div className="flex flex-wrap gap-4">
                {contentList.length > 0 ? (
                    contentList.map((content) => (
                        <ContentCard
                            key={content._id}
                            _id={content._id}
                            title={content.title}
                            thumbnailPath={content.thumbnailPath}
                            type={content.type}
                            publish={content.publish}
                            status={content.status}
                            year={content.year}
                            runtime={content.runtime}
                            overview={content.overview}
                            imdbRating={content.imdbRating}
                            onDelete={handleContentDelete}
                        />
                    ))
                ) : (
                    !isLoading && <div className="text-gray-400">No content available</div>
                )}
            </div>
        </div>
    );
};

export default MediaTab;