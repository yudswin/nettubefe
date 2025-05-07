import { useState, useEffect } from "react";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { ContentService } from "@services/content.service";
import ContentCard from "@components/ui/ContentCard";
import { Content } from "../../types/content";
import CreateContentModal from "@components/create/CreateContentModal";

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

    const handleContentUpdate = (updatedContent: Content) => {
        setContentList(prev => prev.map(content =>
            content._id === updatedContent._id ? updatedContent : content
        ));
    }

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

    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleContentCreated = (newContent: Content) => {
        setContentList(prev => [...prev, newContent]);
    };


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

            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold mb-6">Content Library</h2>
                <button
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 btn btn-ghost"
                    onClick={() => setShowCreateModal(true)}>
                    Add New Content
                </button>
            </div>
            <CreateContentModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onContentCreated={handleContentCreated}
            />
            <div className="flex flex-wrap gap-8">
                {contentList.length > 0 ? (
                    contentList.map((content) => (
                        <ContentCard
                            key={content._id}
                            _id={content._id}
                            title={content.title}
                            thumbnailPath={content.thumbnailPath}
                            bannerPath={content.bannerPath}
                            type={content.type}
                            publish={content.publish}
                            status={content.status}
                            year={content.year}
                            runtime={content.runtime}
                            overview={content.overview}
                            imdbRating={content.imdbRating}
                            onDelete={handleContentDelete}
                            onUpdate={handleContentUpdate}
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