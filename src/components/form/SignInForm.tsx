// SignInForm.tsx
import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { useAuth } from "@contexts/AuthContext";
import { useLanguage } from "@contexts/LanguageContext";
import { AuthService } from "@services/auth.service";
import { useState } from "react";

interface SignInProps {
    onSwitch: () => void;
    onComplete: () => void;
}

export const SignInForm = ({ onSwitch, onComplete }: SignInProps) => {
    const { t } = useLanguage();
    const { login, info } = useAuth();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(prev => ({ ...prev, show: false }));

        try {
            setLoading(true);
            const response = await AuthService.login(credentials);

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: response.msg || t.loginSuccess,
                    type: 'success'
                });

                login({
                    accessToken: response.details.accessToken,
                    refreshToken: response.details.refreshToken
                });

                const userInfo = await AuthService.info();
                if (userInfo.status === 'success') {
                    info(userInfo.result.user);
                    onComplete();
                }
            } else {
                throw new Error(response.details.error || t.genericError);
            }
        } catch (error) {
            setToast({
                show: true,
                message: t.genericError + error,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
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

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />

            <h2 className="text-2xl font-bold mb-6 text-center">{t.signInTitle}</h2>

            <form className="flex flex-col gap-4 items-center justify-center">
                <input
                    type="email"
                    name="email"
                    placeholder={t.signIn_email}
                    value={credentials.email}
                    onChange={handleChange}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder={t.signIn_password}
                    value={credentials.password}
                    onChange={handleChange}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                    required
                />

                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-8 btn btn-primary bg-amber-500 hover:bg-amber-600 border-none"
                    disabled={loading}
                >
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
};
