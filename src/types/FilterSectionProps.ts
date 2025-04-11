export type FilterSectionProps = {
    isMobile: boolean;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
    comboFilter: string;
    setComboFilter: (value: string) => void;
    sentFilter: string;
    setSentFilter: (value: string) => void;
    readFilter: string;
    setReadFilter: (value: string) => void;
};
