import { Department } from "../../types/department";

interface SearchResultsProps {
    departments: Department[];
    onResultClick: (department: Department) => void;
}

export const DeptSearchResult = ({ departments, onResultClick }: SearchResultsProps) => (
    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-y-visible">
        {departments.map((department) => (
            <div
                key={department._id}
                className="p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => onResultClick(department)}
            >
                <span className="text-gray-100">{department.name}</span>
            </div>
        ))}
    </div>
);