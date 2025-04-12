import { useEffect, useState } from 'react';
import { supabase } from '../superbase';
import toast from 'react-hot-toast';
import { useProtectRoute } from '../hooks/useProtectRout';
import { useUser } from '../context/userContext';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../components/LanguageSelector';
import { useDarkMode } from '../hooks/darkMode';
import { useThemeStore } from '../zustand/store/themeStore';

export const SettingsPage = () => {
    const { t } = useTranslation();

    const options = [
        { id: 'profile', label: t('settings.tabs.profile') },
        { id: 'notifications', label: t('settings.tabs.notifications') },
        { id: 'password', label: t('settings.tabs.password') },
        { id: 'preferences', label: t('settings.tabs.preferences') },
        { id: 'security', label: t('settings.tabs.security') },
    ];

    const [selected, setSelected] = useState('profile');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { userData, isLoading } = useUser();
    const [enabled, setEnabled] = useDarkMode();

    useProtectRoute();

    const theme = useThemeStore((state) => state.theme);
    const setTheme = useThemeStore((state) => state.setTheme);
    const handleChangePassword = async () => {
        setMessage('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            const msg = t('settings.password.fillAllFields');
            setMessage(msg);
            return;
        }

        if (newPassword !== confirmPassword) {
            const msg = t('settings.password.passwordMismatch');
            setMessage(msg);
            return;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
            const msg = t('settings.password.invalidSession');
            setMessage(msg);
            toast.error(msg);
            return;
        }

        const email = sessionData.session.user.email;

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email!,
            password: currentPassword,
        });

        if (signInError) {
            const msg = t('settings.password.incorrectCurrent');
            setMessage(msg);
            toast.error(msg);
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setMessage(`${t('settings.password.errorUpdating')}: ${error.message}`);
        } else {
            const msg = t('settings.password.success');
            setMessage(msg);
            toast.success(msg);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    if (isLoading) return <p>{t('settings.loadingUser')}</p>;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300 p-4 sm:p-8 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl flex flex-col sm:flex-row">
                {/* Sidebar/Menu */}
                <aside className="border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap sm:hidden p-2 gap-2 justify-center">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                className={`px-3 py-2 rounded text-sm font-medium ${selected === opt.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setSelected(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden sm:flex sm:flex-col sm:w-48 p-4 gap-2">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                className={`text-left px-3 py-2 rounded text-sm font-medium ${selected === opt.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setSelected(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="flex-1 p-4 sm:p-6">
                    {/* Aba de Perfil */}
                    {selected === 'profile' && (
                        <div className="space-y-4">
                            <div className="w-40 h-40 border border-gray-300 shadow-sm rounded-lg">
                                <img
                                    src={userData?.avatar_url}
                                    alt={t('settings.profile.photoAlt')}
                                    className="w-40 object-cover"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    {t('settings.profile.name')}
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                    value={userData?.name}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    {t('settings.profile.email')}
                                </label>
                                <input
                                    type="email"
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                    value={userData?.email}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}

                    {/* Aba de Notificações */}
                    {selected === 'notifications' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                    {t('settings.notifications.email')}
                                </span>
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                    {t('settings.notifications.push')}
                                </span>
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    )}

                    {/* Aba de Senha */}
                    {selected === 'password' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                {t('settings.password.title')}
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder={t('settings.password.current')}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                                <input
                                    type="password"
                                    placeholder={t('settings.password.new')}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                                <input
                                    type="password"
                                    placeholder={t('settings.password.confirm')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                                <hr className="my-4 border-gray-300 dark:border-gray-600" />
                                <button
                                    onClick={handleChangePassword}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {t('settings.password.updateButton')}
                                </button>
                                {message && (
                                    <p
                                        className={`text-sm mt-2 ${message.includes(t('settings.password.success'))
                                            ? 'text-green-600'
                                            : 'text-red-500'
                                            }`}
                                    >
                                        {message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {selected === 'preferences' && (
                        <div className="space-y-4">
                            {/* Tema */}
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    {t('settings.preferences.theme')}
                                </label>
                                <select
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                                >
                                    <option value="light">{t('settings.preferences.light')}</option>
                                    <option value="dark">{t('settings.preferences.dark')}</option>
                                </select>
                            </div>

                            {/* Idioma */}
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    {t('settings.preferences.language')}
                                </label>
                                <LanguageSelector />
                            </div>
                        </div>
                    )}

                    {/* Aba de Segurança */}
                    {selected === 'security' && (
                        <div className="space-y-4">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t('settings.security.lastLogin')}: <strong>10/04/2025 21:30</strong>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t('settings.security.devices')}:
                                <ul className="list-disc list-inside mt-1">
                                    <li>Chrome - Windows</li>
                                    <li>Safari - iPhone</li>
                                </ul>
                            </div>
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                {t('settings.security.disconnect')}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
