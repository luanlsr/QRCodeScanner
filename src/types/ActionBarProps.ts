export type ActionBarProps = {
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
