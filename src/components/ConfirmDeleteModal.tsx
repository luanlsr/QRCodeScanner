import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

type ConfirmDeleteModalProps = {
    isOpen: boolean;
    personName: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export const ConfirmDeleteModal = ({
    isOpen,
    personName,
    onCancel,
    onConfirm,
}: ConfirmDeleteModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={t('participants.modals.confirmDelete.title')}>
            <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-200">
                    {t('participants.modals.confirmDelete.message', { name: personName })} ?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-white"
                    >
                        {t('participants.modals.confirmDelete.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        {t('participants.modals.confirmDelete.confirm')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
