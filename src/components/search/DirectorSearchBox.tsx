import React, { useState } from 'react';
import { Person } from '../../types/person';
import { PersonService } from '@services/person.service';
import { DirectorSearchResult } from './DirectorSearchResult';

interface DirectorSearchBoxProps {
    className?: string;
    onSelect?: (person: Person) => void;
}

const DirectorSearchBox = ({
    className = '',
    onSelect
}: DirectorSearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [peopleResult, setPeopleResult] = useState<Person[]>([]);

    const handleSearch = async () => {
        const response = await PersonService.searchPerson(searchTerm);

        if (response.status === 'success') {
            setPeopleResult(response.result);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setPeopleResult([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSelect = (person: Person) => {
        if (onSelect) {
            onSelect(person);
        }
        setSearchTerm('');
        setPeopleResult([]);
    };

    return (
        <div className={`hidden md:block flex-1 max-w-xl mx-8 ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search people..."
                    className={`w-full input input-bordered bg-gray-800 text-gray-100 placeholder-gray-400 rounded-lg pl-4 ${searchTerm ? 'pr-20' : 'pr-10'
                        } py-2 focus:outline-none focus:border-none focus:ring-1 focus:ring-amber-500`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchTerm && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-circle btn-sm hover:bg-gray-700/50"
                            onClick={handleClear}
                            aria-label="Cancel search"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-ghost btn-circle btn-sm hover:bg-gray-700/50"
                        onClick={handleSearch}
                        aria-label="Search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>

                {peopleResult.length > 0 && (
                    <DirectorSearchResult
                        people={peopleResult}
                        onResultClick={handleSelect}
                    />
                )}
            </div>
        </div>
    );
};

export default DirectorSearchBox;