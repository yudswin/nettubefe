import { Genre } from "../../types/genre";

interface SearchResultsProps {
    genres: Genre[];
    onResultClick: (genre: Genre) => void;
}

export const GenreSearchResult = ({ genres, onResultClick }: SearchResultsProps) => (
    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-y-visible">
        {genres.map((genre) => (
            <div
                key={genre._id}
                className="p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => onResultClick(genre)}
            >
                <span className="text-gray-100">{genre.name || genre._id}</span>
            </div>
        ))}
    </div>
);