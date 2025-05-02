import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

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
                                <SignInForm onSwitch={() => setIsLogin(false)} />
                            ) : (
                                <SignUpForm onSwitch={() => setIsLogin(true)} />
                            )}
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    )
}

const SignInForm = ({ onSwitch }: { onSwitch: () => void }) => {
    const { t } = useLanguage();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // submits
        console.log('Signing in with:', credentials);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    return (
        <div className="transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-6 text-center">{t.signInTitle}</h2>
            <form className="flex flex-col gap-4 items-center justify-center">
                <input
                    type="text"
                    name="email"
                    placeholder={t.signIn_email}
                    value={credentials.email}
                    onChange={handleChange}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                />
                <input
                    type="password"
                    name="password"
                    placeholder={t.signIn_password}
                    value={credentials.password}
                    onChange={handleChange}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                />
                <button type="submit" onClick={handleSubmit} className="px-8 btn btn-primary bg-amber-500 hover:bg-amber-600 border-none">
                    {t.signInButton}
                </button>
                <div className="text-center mt-4">
                    <span className="text-gray-400">{t.signInChange}</span>
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="text-amber-500 hover:text-amber-600 font-medium"
                    >
                        {t.signUpTitle}
                    </button>
                </div>
            </form>
        </div>
    );
}
const SignUpForm = ({ onSwitch }: { onSwitch: () => void }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add validation and sign up logic here
        console.log('Signing up with:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-center">{t.signUpTitle}</h2>
            <form className="flex flex-col gap-4 items-center justify-center">
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.signUp_email}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                />
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.signUp_name}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t.signUp_password}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t.signUp_repassword}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                />
                <button type="submit" onClick={handleSubmit} className="px-8 btn btn-primary bg-amber-500 hover:bg-amber-600 border-none">
                    {t.signUpButton}
                </button>
                <div className="text-center mt-4">
                    <span className="text-gray-400">{t.signUpChange}</span>
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="text-amber-500 hover:text-amber-600 font-medium"
                    >
                        {t.signInTitle}
                    </button>
                </div>
            </form>
        </div>
    );
}
export default AuthModel;
