import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { Person } from "../../types/person";
import { useEffect, useState } from "react";
import PersonCard from "@components/ui/PersonCard";
import { PersonService } from "@services/person.service";


const PersonTab = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [personList, setPersonList] = useState<Person[]>([]);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const fetchPerson = async () => {
        try {
            setIsLoading(true);
            const response = await PersonService.getPersonList();

            if (response.status === 'success') {
                setPersonList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to load person',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePerson = (updatedPerson: Person) => {
        setPersonList(prev => prev.map(person =>
            person._id === updatedPerson._id ? updatedPerson : person
        ));
    };

    const handleDeletePerson = (deletedId: string) => {
        setPersonList(prev => prev.filter(person => person._id !== deletedId));
    };

    useEffect(() => {
        fetchPerson();
    }, []);

    return (
        <div className="p-4">
            {isLoading && <FullPageLoader />}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            <h2 className="text-2xl font-bold mb-6">Person Library</h2>
            <div className="flex flex-wrap gap-4">
                {personList.length > 0 ? (
                    personList.map((person) => (
                        <PersonCard
                            key={person._id}
                            _id={person._id}
                            name={person.name}
                            profilePath={person.profilePath}
                            slug={person.slug}
                            onDelete={handleDeletePerson}
                            onUpdate={handleUpdatePerson}
                        />
                    ))
                ) : (
                    !isLoading && <div className="text-gray-400">No person available</div>
                )}
            </div>
        </div>

    )
}

export default PersonTab