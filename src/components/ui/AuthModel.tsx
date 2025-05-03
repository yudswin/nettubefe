import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@contexts/LanguageContext";
import { SignInForm } from "@components/form/SignInForm";
import { SignUpForm } from "@components/form/SignUpForm";

interface AuthModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModel = ({ isOpen, onClose }: AuthModelProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isLogin, setIsLogin] = useState(true)
    const { t } = useLanguage();


    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        isOpen ? dialog.showModal() : dialog.close();
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => isOpen && onClose();
        dialog.addEventListener('close', handleClose);
        return () => dialog.removeEventListener('close', handleClose);
    }, [isOpen, onClose]);

    return (
        <>
            <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex bg-gray-900 max-w-4xl w-full p-0 rounded-lg h-[500px]">
                    <div className="flex w-full h-full">
                        <div className="w-full p-8 flex flex-col">
                            <button
                                onClick={onClose}
                                className="btn btn-sm btn-circle btn-ghost ml-auto -mt-2 -mr-2"
                                aria-label={t.close}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {isLogin ? (
                                <SignInForm onSwitch={() => setIsLogin(false)} onComplete={() => {
                                    onClose()
                                    window.location.reload();
                                }} />
                            ) : (
                                <SignUpForm onSwitch={() => setIsLogin(true)} onComplete={() => {
                                    onClose()
                                    window.location.reload();
                                }} />
                            )}
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default AuthModel;
