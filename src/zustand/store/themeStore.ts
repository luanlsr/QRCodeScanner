import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
    // Verifica tema salvo no localStorage ou sistema
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: Theme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    // Aplica o tema ao <html>
    if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    return {
        theme: initialTheme,
        setTheme: (theme: Theme) => {
            localStorage.setItem('theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
            set({ theme });
        },
        toggleTheme: () => {
            set((state) => {
                const newTheme = state.theme === 'dark' ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
                return { theme: newTheme };
            });
        },
    };
});
