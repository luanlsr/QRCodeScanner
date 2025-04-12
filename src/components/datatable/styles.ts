// src/components/DataTable/styles.ts

import { createTheme } from 'react-data-table-component';

export const createCustomStyles = (isDarkMode: boolean) => ({
    headCells: {
        style: {
            backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontWeight: '600',
            fontSize: '14px',
            paddingTop: '16px',
            paddingBottom: '16px',
        },
    },
    rows: {
        style: {
            minHeight: '64px',
            fontSize: '15px',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f9fafb' : '#111827',
        },
    },
    cells: {
        style: {
            paddingTop: '12px',
            paddingBottom: '12px',
        },
    },
    pagination: {
        style: {
            backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
            color: isDarkMode ? '#f9fafb' : '#111827',
        },
    },
});

// Cria tema escuro personalizado
export const createCustomDarkTheme = () =>
    createTheme('dark', {
        text: {
            primary: '#ffffff',
            secondary: '#cccccc',
        },
        background: {
            default: '',
        },
        context: {
            background: '#262626',
            text: '#ffffff',
        },
        divider: {
            default: '#374151',
        },
        button: {
            default: '#ffffff',
            hover: '#e2e8f0',
            focus: '#e2e8f0',
            disabled: '#9ca3af',
        },
        sortFocus: {
            default: '#3b82f6',
        },
    });
