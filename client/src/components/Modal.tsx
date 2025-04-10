import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}: ModalProps) => {
    if (!isOpen) return null;

    const sizeClass = {
        sm: 'w-full max-w-xs max-h-[400px]',
        md: 'w-full max-w-sm max-h-[500px]',
        lg: 'w-full max-w-md max-h-[600px]',
        xl: 'w-full max-w-lg max-h-[700px]',
        xxl: 'w-full max-w-xl max-h-[800px]',
    }[size];

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white dark:bg-zinc-900 text-black dark:text-white w-full ${sizeClass} mx-4 rounded-lg shadow-lg`}
            >
                <div className="flex justify-between items-center p-4 border-b dark:border-zinc-700">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};
