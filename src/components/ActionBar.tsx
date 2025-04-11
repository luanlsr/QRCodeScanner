import { Plus, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BulkDeleteModal } from './BulkDeleteModal';

type ActionBarProps = {
    isMobile: boolean;
    isAllSelected: boolean;
    search: string;
    setSearch: (value: string) => void;
    setShowAddModal: (value: boolean) => void;
    selectedCount: number;
    onSelectAll: () => void;
    onBulkDelete: () => void;
    comboFilter: string;
    setComboFilter: (value: string) => void;
    sentFilter: string;
    setSentFilter: (value: string) => void;
    readFilter: string;
    setReadFilter: (value: string) => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
};

export const ActionBar = ({
    isMobile,
    isAllSelected,
    search,
    setSearch,
    setShowAddModal,
    selectedCount,
    onSelectAll,
    onBulkDelete,
    comboFilter,
    setComboFilter,
    sentFilter,
    setSentFilter,
    readFilter,
    setReadFilter,
    showFilters,
    setShowFilters,
}: ActionBarProps) => {
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const { t } = useTranslation();

    const handleConfirmBulkDelete = () => {
        onBulkDelete();
        setShowBulkDeleteModal(false);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                {/* Input de busca */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('participants.actionBar.searchPlaceholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded px-3 py-2 w-full sm:w-64 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 w-full sm:w-auto justify-end flex-wrap">
                    {!isMobile && (
                        <button
                            onClick={onSelectAll}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-white"
                        >
                            {isAllSelected ? t('participants.actionBar.deselectAll') : t('participants.actionBar.selectAll')}
                        </button>
                    )}
                    <button
                        onClick={() => setShowBulkDeleteModal(true)}
                        disabled={selectedCount === 0}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-white disabled:opacity-50"
                    >
                        <Trash2 className="inline w-4 h-4 mr-1" /> {t('participants.actionBar.deleteSelected')}
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        <Plus className="inline w-4 h-4 mr-1" /> {t('participants.actionBar.new')}
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                    >
                        {showFilters ? t('participants.actionBar.hideFilters') : t('participants.actionBar.showFilters')}
                    </button>
                </div>
            </div>

            {/* Filtros */}
            {showFilters && (
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <select
                        value={comboFilter}
                        onChange={e => setComboFilter(e.target.value)}
                        className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">{t('all')}</option>
                        <option value="nome">{t('name')}</option>
                        <option value="email">{t('email')}</option>
                        <option value="telefone">{t('phone')}</option>
                    </select>

                    <select
                        value={sentFilter}
                        onChange={e => setSentFilter(e.target.value)}
                        className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">{t('participants.table.sent')}</option>
                        <option value="sim">{t('participants.common.yes')}</option>
                        <option value="nao">{t('participants.common.no')}</option>
                    </select>

                    <select
                        value={readFilter}
                        onChange={e => setReadFilter(e.target.value)}
                        className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">{t('read')}</option>
                        <option value="sim">{t('yes')}</option>
                        <option value="nao">{t('no')}</option>
                    </select>
                </div>
            )}

            {/* Modal de exclusão em massa */}
            {showBulkDeleteModal && (
                <BulkDeleteModal
                    count={selectedCount}
                    onCancel={() => setShowBulkDeleteModal(false)}
                    onConfirm={handleConfirmBulkDelete}
                />
            )}
        </>
    );
};
