import { useLanguage } from "@contexts/LanguageContext";

interface LibraryContentProps {
    libraryId: number | null;
}

export const LibraryContent = ({ libraryId }: LibraryContentProps) => {
    const { t } = useLanguage();
    
    // // Get library-specific content based on libraryId
    // const libraryContent = {
    //     1: { title: t.movies, content: [...] },
    //     2: { title: t.tvShows, content: [...] },
    // };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                {/* {libraryId ? libraryContent[libraryId].title : t.library} */}
                <>Lib</>
            </h2>
            {/* Render library-specific content */}
        </div>
    )
}