import { Person } from "../../types/person";

interface SearchResultsProps {
    people: Person[];
    onResultClick: (person: Person) => void;
}

export const DirectorSearchResult = ({ people, onResultClick }: SearchResultsProps) => (
    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-y-visible">
        {people.map((person) => (
            <div
                key={person._id}
                className="p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => onResultClick(person)}
            >
                <span className="text-gray-100">{person.name || person._id}</span>
            </div>
        ))}
    </div>
);