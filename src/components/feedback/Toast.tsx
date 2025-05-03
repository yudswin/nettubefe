import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    duration?: number;
    onClose: () => void;
}

export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="toast toast-top toast-center">
            <div className={`alert alert-${type} flex items-center`}>
                <div className="flex-1 flex flex-row items-center gap-2">
                    {type === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span>{message}</span>
                </div>
                {/* <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                    ✕
                </button> */}
            </div>
        </div>
    );
};