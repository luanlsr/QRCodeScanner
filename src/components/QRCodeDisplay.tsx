import React from 'react';
import QRCode from 'react-qr-code';
import { useTranslation } from 'react-i18next';
import { QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
    value: string;
    size?: number;
    showToggle?: boolean;
    isVisible?: boolean;
    onToggle?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
    value,
    size = 180,
    showToggle = false,
    isVisible = true,
    onToggle
}) => {
    const { t } = useTranslation();

    return (
        <>
            {showToggle && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={onToggle}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center dark:bg-blue-600 dark:hover:bg-blue-700"
                        title={t('participants.qrCode.view')}
                    >
                        <QrCode size={16} className="mr-2" />
                        {isVisible ? t('participants.qrCode.hide') : t('participants.qrCode.view')}
                    </button>
                </div>
            )}

            {isVisible && (
                <div className="relative bg-white p-4 rounded shadow-lg border mt-2 flex justify-center dark:bg-gray-800 dark:border-gray-600">
                    <div className="p-3 bg-white rounded">
                        <QRCode value={value} size={size} />
                    </div>
                </div>
            )}
        </>
    );
}; 
