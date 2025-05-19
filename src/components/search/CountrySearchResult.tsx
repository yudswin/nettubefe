import { Country } from "../../types/country";

interface SearchResultsProps {
    countries: Country[];
    onResultClick: (country: Country) => void;
}

export const CountrySearchResult = ({ countries, onResultClick }: SearchResultsProps) => (
    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-y-visible">
        {countries.map((country) => (
            <div
                key={country._id}
                className="p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => onResultClick(country)}
            >
                <span className="text-gray-100">{country.name || country._id}</span>
            </div>
        ))}
    </div>
);