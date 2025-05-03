import { FullPageLoader } from "@components/feedback/FullPageLoader";
import { Toast } from "@components/feedback/Toast";
import { useAuth } from "@contexts/AuthContext";
import { useLanguage } from "@contexts/LanguageContext";
import { AuthService } from "@services/auth.service";
import { useState } from "react";

interface SignUpProps {
    onSwitch: () => void;
    onComplete: () => void;
}

export const SignUpForm = ({ onSwitch, onComplete }: SignUpProps) => {
    const { t } = useLanguage();
    const { login, info } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(prev => ({ ...prev, show: false }));

        if (formData.password !== formData.confirmPassword) {
            setToast({
                show: true,
                message: t.passwordMismatch,
                type: 'error'
            });
            return;
        }

        try {
            setLoading(true);
            const registerResponse = await AuthService.register(formData);

            if (registerResponse.status !== 'success') {
                throw new Error(registerResponse.details.error || t.registrationFailed);
            }

            setToast({
                show: true,
                message: t.registrationSuccess,
                type: 'success'
            });

            const loginResponse = await AuthService.login({
                email: formData.email,
                password: formData.password
            });

            if (loginResponse.status === 'success') {
                login({
                    accessToken: loginResponse.details.accessToken,
                    refreshToken: loginResponse.details.refreshToken
                });

                const userInfo = await AuthService.info();
                if (userInfo.status === 'success') {
                    info(userInfo.result.user);
                    onComplete();
                }
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
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="transition-all duration-300">
            {loading && <FullPageLoader />}

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />

            <h2 className="text-2xl font-bold mb-6 text-center">{t.signUpTitle}</h2>

            <form className="flex flex-col gap-4 items-center justify-center">
                <input
                    type="email"
                    name="email"
                    placeholder={t.signUp_email}
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                    required
                />

                <input
                    type="text"
                    name="name"
                    placeholder={t.signUp_name}
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder={t.signUp_password}
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-bordered bg-gray-800 border-gray-700 text-white"
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder={t.signUp_repassword}
                    value={formData.confirmPassword}
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
                    {t.signUpButton}
                </button>

                <div className="text-center mt-4">
                    <span className="text-gray-400">{t.signUpChange}</span>
                    <button
                        type="button"
                        onClick={onSwitch}
                        disabled={loading}
                        className="text-amber-500 hover:text-amber-600 font-medium"
                    >
                        {t.signInTitle}
                    </button>
                </div>
            </form>
        </div>
    );
};
