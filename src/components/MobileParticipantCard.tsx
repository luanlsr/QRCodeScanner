import React, { useState } from 'react';
import { Person } from '../models/Person';
import { formatPhoneNumber } from '../utils/utils';
import { Pencil, QrCode, Trash2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { QRCodeDisplay } from './QRCodeDisplay';
import { FaWhatsapp } from 'react-icons/fa';

interface MobileParticipantCardProps {
    participant: Person;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onEdit: (participant: Person) => void;
    onDelete: (id: string) => void;
    onShowQrCode: (participant: Person) => void;
    onSendWhatsApp?: (participant: Person) => void;
}

export const MobileParticipantCard: React.FC<MobileParticipantCardProps> = ({
    participant,
    isSelected,
    onToggleSelect,
    onEdit,
    onDelete,
    onShowQrCode,
    onSendWhatsApp
}) => {
    const { t } = useTranslation();
    const [showQrCode, setShowQrCode] = useState(false);

    const toggleQrCode = () => {
        setShowQrCode(!showQrCode);
        if (!showQrCode) {
            onShowQrCode(participant);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {/* Checkbox e Nome */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(participant.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <h3 className="font-medium text-gray-900 truncate dark:text-white">
                        {participant.name} {participant.last_name}
                    </h3>
                </div>
                <div className="flex space-x-2">
                    {/* Status Indicadores */}
                    {participant.sent && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            {t('participants.status.sent')}
                        </span>
                    )}
                    {participant.read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                            {t('participants.status.read')}
                        </span>
                    )}
                </div>
            </div>

            {/* Detalhes do Participante */}
            <div className="text-sm text-gray-600 mb-3 dark:text-gray-300">
                {participant.email && <p>{participant.email}</p>}
                {participant.phone && <p>{formatPhoneNumber(participant.phone)}</p>}
            </div>

            {/* QR Code Display */}
            {showQrCode && (
                <QRCodeDisplay value={participant.id} size={150} />
            )}

            {/* Ações */}
            <div className="flex space-x-2 justify-end mt-2">
                <button
                    onClick={() => onEdit(participant)}
                    className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    title={t('common.edit')}
                >
                    <Pencil size={16} />
                </button>
                {onSendWhatsApp && (
                    <button
                        onClick={() => onSendWhatsApp(participant)}
                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800"
                        title={t('participants.sendWhatsApp')}
                    >
                        <FaWhatsapp size={16} />
                    </button>
                )}
                <button
                    onClick={toggleQrCode}
                    className="p-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800"
                    title={t('participants.qrCode.view')}
                >
                    <QrCode size={16} />
                </button>
                <button
                    onClick={() => onDelete(participant.id)}
                    className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                    title={t('common.delete')}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
