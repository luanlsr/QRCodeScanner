import { useEffect, useState } from 'react';

export const useDarkMode = () => {
    const [enabled, setEnabled] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme === 'dark' || (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (enabled) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [enabled]);

    return [enabled, setEnabled] as const;
};
