import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { useAuth } from "@contexts/AuthContext";
import { useLanguage } from "@contexts/LanguageContext";
import { AuthService } from "@services/auth.service";
import { useState } from "react";

interface SignInProps {
    onSwitch: () => void,
    onComplete: () => void,
}

export const SignInForm = ({ onSwitch, onComplete }: SignInProps) => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const { login, info } = useAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // console.log('Signing in with:', credentials);
        setToast(prev => ({ ...prev, show: false }));
        const response = await AuthService.login(credentials);
        if (response.status === 'success' && response) {
            setToast({
                show: true,
                message: response.msg || 'Login successful! Redirecting...',
                type: 'success'
            });
            login({
                accessToken: response.details.accessToken,
                refreshToken: response.details.refreshToken
            });
            const getInfo = await AuthService.info();
            if (getInfo.status === 'success' && getInfo) {
                info(getInfo.result.user)
                onComplete()
            }
        } else {
            setToast({
                show: true,
                message: response.details.error || 'Login failed',
                type: 'error'
            });
        }
        setLoading(false)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    return (
        <div className="transition-transform duration-300">
            {loading && <FullPageLoader />}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}
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
                        disabled={loading}
                        className="text-amber-500 hover:text-amber-600 font-medium"
                    >
                        {t.signUpTitle}
                    </button>
                </div>
            </form>
        </div>
    );
}