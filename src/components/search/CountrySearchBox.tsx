import React, { useState, useEffect } from 'react';
import { Country } from '../../types/country';
import { CountryService } from '@services/country.service';
import { CountrySearchResult } from './CountrySearchResult';

interface CountrySearchBoxProps {
    className?: string;
    onSelect?: (country: Country) => void;
}

const CountrySearchBox = ({
    className = '',
    onSelect
}: CountrySearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await CountryService.getCountryList();
            if (response.status === 'success') {
                setCountries(response.result);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCountries([]);
            return;
        }
        const filtered = countries.filter(country =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCountries(filtered);
    }, [searchTerm, countries]);

    const handleClear = () => {
        setSearchTerm('');
        setFilteredCountries([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Optional: Implement if needed
        }
    };

    const handleSelect = (country: Country) => {
        if (onSelect) {
            onSelect(country);
        }
        setSearchTerm('');
        setFilteredCountries([]);
    };

    return (
        <div className={`hidden md:block flex-1 max-w-xl mx-8 ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search countries..."
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
                            ✕
                        </button>
                    )}
                </div>

                {filteredCountries.length > 0 && (
                    <CountrySearchResult
                        countries={filteredCountries}
                        onResultClick={handleSelect}
                    />
                )}
            </div>
        </div>
    );
};

export default CountrySearchBox;