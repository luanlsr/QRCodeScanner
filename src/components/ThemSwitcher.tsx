import { Switch } from '@headlessui/react'; // ou substitua pelo seu componente
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../hooks/darkMode';

export const ThemePreference = () => {
    const { t } = useTranslation();
    const [enabled, setEnabled] = useDarkMode();

    return (
        <div className="space-y-2">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                {t('settings.preferences.theme')}
            </label>

            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {enabled ? t('settings.preferences.dark') : t('settings.preferences.light')}
                </span>

                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                >
                    <span className="sr-only">{t('header.dark_mode')}</span>
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-900 shadow transition duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                    />
                </Switch>
            </div>
        </div>
    );
};
