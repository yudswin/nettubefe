import { Content } from "../../types/content";

interface SearchResultsProps {
    contents: Content[];
    onResultClick: (content: Content) => void;
}

export const ContentSearchResult = ({ contents, onResultClick }: SearchResultsProps) => (
    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-y-visible">
        {contents.map((content) => (
            <div
                key={content._id}
                className="p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => onResultClick(content)}
            >
                <span className="text-gray-100">{content.title}</span>
                {content.year && (
                    <span className="text-gray-400 ml-2">({content.year})</span>
                )}
                <span className="badge badge-sm ml-2">{content.type}</span>
            </div>
        ))}
    </div>
);