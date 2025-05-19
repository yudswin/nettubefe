import { useState, useEffect } from "react";
import { Country } from "../../types/country";
import { CountryService } from "@services/country.service";
import CountrySearchBox from "../search/CountrySearchBox";

interface AddCountryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCountryAdded?: (country: Country) => void;
    contentId: string;
}

const AddCountryModal = ({
    isOpen,
    onClose,
    onCountryAdded,
    contentId
}: AddCountryModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedCountry(null);
            setToast({ show: false, message: '', type: 'success' });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCountry) return;

        setIsLoading(true);
        try {
            const response = await CountryService.addCountryToContent(
                contentId,
                [selectedCountry._id]
            );

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Country added successfully',
                    type: 'success'
                });

                if (onCountryAdded) {
                    onCountryAdded(selectedCountry);
                }

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to add country',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'An error occurred while adding country',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box relative h-1/2">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold mb-4">Add Country</h3>

                <div className="form-control">
                    <CountrySearchBox
                        onSelect={(country) => setSelectedCountry(country)}
                        className="mb-4"
                    />
                </div>

                {selectedCountry && (
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Selected Country:</h4>
                        <div className="badge badge-primary badge-lg">
                            {selectedCountry.name || selectedCountry._id}
                        </div>
                    </div>
                )}

                {toast.show && (
                    <div className={`alert alert-${toast.type} mt-4`}>
                        <span>{toast.message}</span>
                    </div>
                )}

                <div className="modal-action">
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!selectedCountry || isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : 'Add Country'}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default AddCountryModal;