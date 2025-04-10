import { Person } from '../models/Person';
import { Popcorn, Pencil, Trash } from 'lucide-react';

interface MobileParticipantCardProps {
    participant: Person;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleCombo: () => void;
}

export const MobileParticipantCard = ({
    participant,
    isSelected,
    onToggleSelect,
    onEdit,
    onDelete,
    onToggleCombo,
}: MobileParticipantCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggleSelect}
                    className="mt-1 w-4 h-4"
                />

                <img
                    src={participant.photo_url || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'}
                    alt={participant.name}
                    className="w-12 h-12 rounded-full object-cover border"
                />

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                            {participant.name}
                        </h3>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                onToggleCombo();
                            }}
                            className="p-1"
                            title="Combo"
                        >
                            <Popcorn
                                size={18}
                                className={participant.combo ? 'text-green-500' : 'text-gray-400'}
                            />
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {participant.email}
                    </p>

                    <div className="flex gap-2 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded ${participant.sent ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {participant.sent ? 'Enviado' : 'Não enviado'}
                        </span>
                        <span className={`px-2 py-1 rounded ${participant.read ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {participant.read ? 'Lido' : 'Não lido'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm flex items-center gap-1"
                >
                    <Pencil size={14} />
                    <span>Editar</span>
                </button>
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm flex items-center gap-1"
                >
                    <Trash size={14} />
                    <span>Excluir</span>
                </button>
            </div>
        </div>
    );
};
