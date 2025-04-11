import { Filter } from 'lucide-react';

type FilterSectionProps = {
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

export const FilterSection = ({
    isMobile,
    showFilters,
    setShowFilters,
    comboFilter,
    setComboFilter,
    sentFilter,
    setSentFilter,
    readFilter,
    setReadFilter,
}: FilterSectionProps) => {
    return (
        <div className="mb-4">
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
            >
                <Filter className="w-4 h-4 mr-1" /> Filtros Avançados
            </button>

            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div>
                        <label className="block text-sm mb-1 dark:text-white">Tipo de Participante</label>
                        <select
                            value={comboFilter}
                            onChange={e => setComboFilter(e.target.value)}
                            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                        >
                            <option value="todos">Todos</option>
                            <option value="convidado">Convidado</option>
                            <option value="palestrante">Palestrante</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1 dark:text-white">E-mail Enviado</label>
                        <select
                            value={sentFilter}
                            onChange={e => setSentFilter(e.target.value)}
                            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                        >
                            <option value="todos">Todos</option>
                            <option value="enviado">Enviado</option>
                            <option value="nao-enviado">Não Enviado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1 dark:text-white">Lido</label>
                        <select
                            value={readFilter}
                            onChange={e => setReadFilter(e.target.value)}
                            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                        >
                            <option value="todos">Todos</option>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};
