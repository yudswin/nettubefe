import { useState, useEffect } from "react";
import { PersonService } from "@services/person.service";
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { Person } from "../../types/person";
import { Departments, PersonDepartmentService } from "@services/junction/personDepartment.service";
import { LoadingSpinner } from "@components/feedback/LoadingSpinner";
import AddDepartmentModal from "@components/create/AddDepartmentModal";
import { Department } from "../../types/department";

interface PersonDetailModelProps {
    person: {
        _id: string;
        name: string;
        slug: string;
        profilePath?: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (deletedId: string) => void;
    onUpdate?: (updatedPerson: Person) => void;
}

const PersonModel = ({ person, isOpen, onClose, onUpdate, onDelete }: PersonDetailModelProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showDepartmentConfirm, setShowDepartmentConfirm] = useState(false);
    const [formData, setFormData] = useState(person);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [newProfilePath, setNewProfilePath] = useState("");
    const [previewProfilePath, setPreviewProfilePath] = useState("");
    const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
    const [departmentList, setDepartmentList] = useState<Departments[]>([]);
    const [departmentToDelete, setDepartmentToDelete] = useState<Departments>();
    const [showCreateModal, setShowCreateModal] = useState(false);


    const fetchDepartment = async () => {
        try {
            setIsDepartmentLoading(true)
            const response = await PersonDepartmentService.getDepartmentList(person._id)
            if (response.status === 'success') {
                setDepartmentList(response.result);
            } else {
                setToast({
                    show: true,
                    message: response.error || 'Failed to load media',
                    type: 'error'
                })
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to connect to server',
                type: 'error'
            });
        } finally {
            setIsDepartmentLoading(false);
        }
    }

    useEffect(() => {
        setFormData(person);
        setIsEditing(false);
        setNewProfilePath(person.profilePath || "");
        setPreviewProfilePath(person.profilePath || "");
        fetchDepartment()
    }, [person]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewDepartment = (newDepartment: Department) => {
        const newDepartmentEntry = {
            departmentId: newDepartment._id,
            departmentName: newDepartment.name
        };
        setDepartmentList(prev => [...prev, newDepartmentEntry])
    }

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const response = await PersonService.updatePerson(formData._id, formData);

            if (response.status === 'success') {
                setToast({ show: true, message: 'updateSuccess', type: 'success' });
                onUpdate?.(formData);
                setIsEditing(false);
            } else {
                setToast({ show: true, message: response.msg || 'updateFailed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'updateError', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDepartmentDelete = async (departmentId?: string) => {
        setShowDepartmentConfirm(false);
        try {
            setIsDepartmentLoading(true);
            if (departmentId) {
                const response = await PersonDepartmentService.removeDepartmentsFromPerson(formData._id, [departmentId]);

                if (response.status === 'success') {
                    setToast({ show: true, message: 'updateSuccess', type: 'success' });
                    setDepartmentList(prev => prev.filter(
                        department => department.departmentId !== departmentId
                    ));
                    setDepartmentToDelete(undefined)
                } else {
                    setToast({ show: true, message: response.msg || 'deleteFailed', type: 'error' });
                }
            }
        } catch (error) {
            setToast({ show: true, message: 'deleteError', type: 'error' });
        } finally {
            setIsDepartmentLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setIsLoading(true);
            const updateData = {
                ...formData,
                profilePath: newProfilePath
            };

            const response = await PersonService.updatePerson(person._id, updateData);

            if (response.status === 'success') {
                setFormData(prev => ({ ...prev, profilePath: newProfilePath }));
                onUpdate?.(updateData);
                setShowProfileModal(false);
                setToast({ show: true, message: 'Profile image updated', type: 'success' });
            } else {
                setToast({ show: true, message: response.msg || 'Update failed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Update error', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setShowConfirmation(false);
        try {
            setIsLoading(true);
            const response = await PersonService.deletePerson(formData._id);

            if (response.status === 'success') {
                setToast({ show: true, message: 'deleteSuccess', type: 'success' });
                onClose();
                onDelete?.(formData._id);
            } else {
                setToast({ show: true, message: response.msg || 'deleteFailed', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'deleteError', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-2xl overflow-hidden">
                <div className="relative">
                    <div
                        className="h-64 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://media.themoviedb.org/${person.profilePath || "/default-profile.jpg"})`,
                        }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-white text-2xl p-2 hover:bg-gray-800 rounded-full"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">
                            {isEditing ? (
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 text-white p-2 rounded w-full"
                                />
                            ) : (
                                formData.name
                            )}
                        </h2>
                        <div className="flex gap-2">
                            {!isEditing && (
                                <button
                                    onClick={() => setShowConfirmation(true)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full"
                                    disabled={isLoading}
                                >
                                    delete
                                </button>
                            )}
                            <button
                                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'saving' : (isEditing ? 'save' : 'edit')}
                            </button>

                            {!isEditing && (
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full"
                                    disabled={isLoading}
                                >
                                    Change Image
                                </button>
                            )}
                        </div>
                    </div>

                    {showConfirmation && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
                                <h3 className="text-lg font-bold mb-4">confirmDelete</h3>
                                <p className="text-gray-300 mb-6">deleteConfirmationText</p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'deleting' : 'confirm'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showDepartmentConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
                                <h3 className="text-lg font-bold mb-4">Confirm</h3>
                                <p className="text-gray-300 mb-6">Confirm delete this department: {departmentToDelete?.departmentName}?</p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setShowDepartmentConfirm(false)
                                            setDepartmentToDelete(undefined)
                                        }}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                        onClick={() => handleDepartmentDelete(departmentToDelete?.departmentId)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'deleting' : 'confirm'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <input
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="bg-gray-800 text-white p-2 rounded w-full mb-4"
                            placeholder="Slug"
                        />
                    ) : (
                        <p className="text-gray-400 mb-4">{formData.slug}</p>
                    )}
                    <dialog className={`modal ${showProfileModal ? 'modal-open' : ''}`}>
                        <div className="modal-box bg-gray-900">
                            <h3 className="font-bold text-lg mb-4">Update Profile Image</h3>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Image URL</span>
                                </label>
                                <input
                                    type="text"
                                    value={newProfilePath}
                                    onChange={(e) => {
                                        setNewProfilePath(e.target.value);
                                        setPreviewProfilePath(e.target.value);
                                    }}
                                    placeholder="Enter image URL"
                                    className="input input-bordered bg-gray-800 text-white"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="label">
                                    <span className="label-text">Preview</span>
                                </label>
                                <div className="aspect-square w-full bg-gray-800 rounded-lg overflow-hidden">
                                    <img
                                        src={`https://media.themoviedb.org/${previewProfilePath}`}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="modal-action mt-6">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowProfileModal(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </dialog>

                </div>
                <div className="p-6 flex flex-wrap gap-2">
                    {isDepartmentLoading && <LoadingSpinner />}
                    {departmentList.map((department) => (
                        <div
                            key={department.departmentId}
                            className="badge badge-outline badge-primary gap-1 hover:bg-primary hover:text-primary-content transition-colors cursor-pointer group"
                            onClick={() => {
                                setShowDepartmentConfirm(true)
                                setDepartmentToDelete(department)
                            }}
                        >
                            <span className="group-hover:hidden transition-opacity">
                                {department.departmentName}
                            </span>
                            <span className="hidden group-hover:inline transition-opacity">
                                Remove
                            </span>
                        </div>
                    ))}
                    <div
                        className="badge badge-primary gap-1 hover:bg-primary hover:text-primary-content transition-colors cursor-pointer"
                        onClick={() => {
                            setShowCreateModal(true)
                        }}
                    >
                        <span>
                            + New Department
                        </span>
                    </div>
                    <AddDepartmentModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onDepartmentAdded={handleNewDepartment}
                        personId={person._id}
                    />
                </div>
            </div>


            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            {isLoading && <FullPageLoader />}
        </div>
    );
};

export default PersonModel;
