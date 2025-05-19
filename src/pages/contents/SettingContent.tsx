import { useAuth } from "@contexts/AuthContext";
import { UserService } from "@services/user.service";
import { AuthService } from "@services/auth.service";
import { useState, useEffect, ChangeEvent, Fragment } from "react";
import { FullPageLoader } from "@components/feedback/FullPageLoader";

const SettingContent = () => {
    const { info, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setGender(user.gender);
        }
    }, [user]);

    useEffect(() => {
        setToast({
            show: false,
            message: '',
            type: 'success'
        })
    }, [])

    const fetchUserLastestInfo = async () => {
        try {
            setIsLoading(true)
            const response = await AuthService.info()
            if (response.status === 'success') {
                info(response.result.user);
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Failed to fetch user info',
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
            setIsLoading(false);
        }
    }

    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            const response = await UserService.uploadAvatar(file);
            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Avatar updated successfully!',
                    type: 'success'
                });
                await fetchUserLastestInfo();
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Avatar update failed',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Error uploading avatar',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            setIsLoading(true);
            const response = await UserService.deleteAvatar();
            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Avatar removed successfully!',
                    type: 'success'
                });
                await fetchUserLastestInfo();
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Avatar removal failed',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Error removing avatar',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserInfoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsLoading(true);
            const response = await UserService.updateUserInfo(
                user._id,
                { name, gender }
            );
            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Profile updated successfully!',
                    type: 'success'
                });
                await fetchUserLastestInfo();
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Profile update failed',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Error updating profile',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (newPassword !== confirmNewPassword) {
            setToast({
                show: true,
                message: 'New passwords do not match!',
                type: 'error'
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await UserService.updateUserPassowrd(currentPassword, newPassword);

            if (response.status === 'success') {
                setToast({
                    show: true,
                    message: 'Password updated successfully!',
                    type: 'success'
                });
                // Clear password fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                setToast({
                    show: true,
                    message: response.msg || 'Password update failed',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Error updating password',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {isLoading && <FullPageLoader />}

            {/* Avatar Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                <div className="flex items-center gap-6">
                    {user?.imgs?.path ? (
                        <img
                            src={user.imgs.path}
                            className="w-24 h-24 rounded-full object-cover"
                            alt="Profile"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">No avatar</span>
                        </div>
                    )}
                    <div className="flex gap-4">
                        {user?.imgs?.path ? <Fragment />
                            :
                            <label className="btn bg-amber-500 cursor-pointer">
                                Upload New
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                />
                            </label>
                        }
                        <button
                            onClick={handleDeleteAvatar}
                            className="btn btn-outline btn-error"
                            disabled={!user?.imgs}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </section>

            {/* User Info Form */}
            <form onSubmit={handleUserInfoUpdate} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="btn bg-amber-500">
                        Update Profile
                    </button>
                </div>
            </form>

            {/* Password Update Form */}
            <form onSubmit={handlePasswordUpdate}>
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="btn bg-amber-500">
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingContent;