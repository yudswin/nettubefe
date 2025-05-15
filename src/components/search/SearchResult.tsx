import { Content } from '../../types/content';
import { Person } from '../../types/person';

interface SearchResultsProps {
    results?: Content[];
    persons?: Person[];
    onResultClick?: (content?: Content, person?: Person) => void;
}

const SearchResults = ({ results, persons, onResultClick }: SearchResultsProps) => {
    const handleClick = (content: Content) => {
        if (onResultClick) {
            onResultClick(content);
        }
    };

    const handlePersonClick = (person: Person) => {
        if (onResultClick) {
            onResultClick(undefined, person);
        }
    }


    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-140 overflow-y-auto z-50">
            {results && results.length > 0 && (
                <>
                    <h2 className='p-2 label'>Movie</h2>
                    {results.map((content) => (
                        <div
                            key={content._id}
                            className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 flex flex-row gap-2 items-center"
                            onClick={() => handleClick(content)}
                        >
                            <div className="w-24 h-24">
                                <img
                                    src={`${content.bannerPath ? content.bannerPath : "/defaultContent.png"}`}
                                    alt={content.title}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div className='w-full h-full'>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white truncate">{content.title}</h3>
                                        {!content.publish && (
                                            <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {content.type === 'movie' ? '🎬 Movie' : '📺 TV Show'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                    {content.year && `Year: ${content.year}`}
                                    {content.runtime && ` • ${content.runtime} mins`}
                                    {content.imdbRating && ` • ⭐ ${content.imdbRating}`}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
            {persons && persons.length > 0 && (
                <>
                    <h2 className='p-2 label'>Person</h2>
                    {persons.map((person) => (
                        <div
                            key={person._id}
                            className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 flex flex-row gap-2"
                            onClick={() => handlePersonClick(person)}
                        >
                            <div className="w-24 h-24">
                                <img
                                    src={`https://media.themoviedb.org/${person.profilePath}`}
                                    alt={`${person.name}`}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white truncate">{person.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default SearchResults;