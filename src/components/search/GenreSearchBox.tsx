import { useState, useEffect } from 'react';
import { Genre } from '../../types/genre';
import { GenreService } from '@services/genre.service';
import { GenreSearchResult } from './GenreSearchResult';

interface GenreSearchBoxProps {
    className?: string;
    onSelect?: (genre: Genre) => void;
}

const GenreSearchBox = ({
    className = '',
    onSelect
}: GenreSearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genres, setGenres] = useState<Genre[]>([]);
    const [filteredGenres, setFilteredGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const fetchGenres = async () => {
            const response = await GenreService.getGenreList();
            if (response.status === 'success') {
                setGenres(response.result);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredGenres([]);
            return;
        }
        const filtered = genres.filter(genre =>
            genre.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGenres(filtered);
    }, [searchTerm, genres]);

    const handleClear = () => {
        setSearchTerm('');
        setFilteredGenres([]);
    };

    const handleSelect = (genre: Genre) => {
        if (onSelect) {
            onSelect(genre);
        }
        setSearchTerm('');
        setFilteredGenres([]);
    };

    return (
        <div className={`hidden md:block flex-1 max-w-xl mx-8 ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search genres..."
                    className={`w-full input input-bordered bg-gray-800 text-gray-100 placeholder-gray-400 rounded-lg pl-4 ${searchTerm ? 'pr-20' : 'pr-10'
                        } py-2 focus:outline-none focus:border-none focus:ring-1 focus:ring-amber-500`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchTerm && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-circle btn-sm hover:bg-gray-700/50"
                            onClick={handleClear}
                            aria-label="Cancel search"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {filteredGenres.length > 0 && (
                    <GenreSearchResult
                        genres={filteredGenres}
                        onResultClick={handleSelect}
                    />
                )}
            </div>
        </div>
    );
};

export default GenreSearchBox;