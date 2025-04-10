import { useEffect, useState, useCallback } from 'react';
import DataTable, { TableColumn, createTheme } from 'react-data-table-component';
import { getAllParticipants, createParticipant, deleteParticipant, updateParticipant } from '../data/crud';
import { Modal } from '../components/Modal';
import { PersonForm } from '../components/PersonForm';
import { ParticipantDetailsModal } from '../components/ParticipantDetailsModal';
import { Plus, Trash, Pencil, Popcorn, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { PersonEditForm } from '../components/PersonEditForm';
import { useProtectRoute } from '../hooks/useProtectRout';
import { Person } from '../models/Person';
import { supabase } from '../superbase';
import { MobileParticipantCard } from '../components/MobileParticipantCard';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const Participants = () => {
    const [participants, setParticipants] = useState<Person[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState<Person[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [comboFilter, setComboFilter] = useState<string>('todos');
    const [sentFilter, setSentFilter] = useState<string>('todos');
    const [readFilter, setReadFilter] = useState<string>('todos');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)');
    useProtectRoute();

    // Estilos personalizados para a tabela
    const customStyles = {
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
    };

    // Tema escuro para a tabela
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

    // Alternar seleção de participantes
    const toggleSelection = useCallback((id: string) => {
        setSelectedParticipants(prev =>
            prev.includes(id)
                ? prev.filter(participantId => participantId !== id)
                : [...prev, id]
        );
    }, []);

    // Selecionar todos os participantes
    const handleSelectAll = useCallback(() => {
        setSelectedParticipants(prev =>
            prev.length === participants.length
                ? []
                : participants.map(participant => participant.id)
        );
    }, [participants]);

    // Exclusão em massa
    const handleBulkDelete = useCallback(() => {
        if (selectedParticipants.length === 0) {
            toast.error("Nenhum participante selecionado!");
            return;
        }
        setShowBulkDeleteModal(true);
    }, [selectedParticipants]);

    // Confirmar exclusão em massa
    const handleConfirmBulkDelete = useCallback(async () => {
        try {
            const { error } = await supabase
                .from("participants")
                .delete()
                .in("id", selectedParticipants);

            if (error) throw error;

            setParticipants(prev =>
                prev.filter(p => !selectedParticipants.includes(p.id))
            );

            setSelectedParticipants([]);
            toast.success("Participantes excluídos com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir participantes.");
        }
        setShowBulkDeleteModal(false);
    }, [selectedParticipants]);

    // Verificar se todos estão selecionados
    const isAllSelected = selectedParticipants.length === participants.length && participants.length > 0;

    // Buscar participantes
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllParticipants();
            setParticipants(data);
            setFiltered(data);
        };
        fetchData();
    }, []);

    // Verificar modo escuro
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        setIsDarkMode(document.documentElement.classList.contains('dark'));

        return () => observer.disconnect();
    }, []);

    // Filtrar participantes
    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFiltered(
            participants.filter(p => {
                const matchName = p.name.toLowerCase().includes(lowerSearch);
                const matchCombo = comboFilter === 'todos' || (comboFilter === 'sim' ? p.combo : !p.combo);
                const matchSent = sentFilter === 'todos' || (sentFilter === 'sim' ? p.sent : !p.sent);
                const matchRead = readFilter === 'todos' || (readFilter === 'sim' ? p.read : !p.read);

                return matchName && matchCombo && matchSent && matchRead;
            })
        );
    }, [search, participants, comboFilter, sentFilter, readFilter]);

    // Alternar status do combo
    const toggleComboStatus = useCallback(async (person: Person) => {
        const novoCombo = !person.combo;
        const novoValor = novoCombo ? person.valor + 15 : person.valor - 15;

        const updated = {
            ...person,
            combo: novoCombo,
            valor: novoValor,
        };

        const result = await updateParticipant(updated.id, updated);
        setParticipants(prev => prev.map(p => (p.id === updated.id ? result : p)));
    }, []);

    // Adicionar participante
    const handleAddPerson = useCallback(async (personData: Omit<Person, 'id'>) => {
        const created = await createParticipant(personData);
        setParticipants(prev => [...prev, created]);
        setShowAddModal(false);
        toast.success('Participante adicionado com sucesso!');
    }, []);

    // Excluir participante
    const handleDeletePerson = useCallback(async (id: string) => {
        await deleteParticipant(id);
        setParticipants(prev => prev.filter(p => p.id !== id));
        toast.success('Participante excluído!');
    }, []);

    // Atualizar participante
    const handleUpdatePerson = useCallback(async (updated: Person) => {
        const result = await updateParticipant(updated.id, updated);
        setParticipants(prev => prev.map(p => (p.id === updated.id ? result : p)));
        setShowEditModal(false);
        toast.success('Participante atualizado com sucesso!');
    }, []);

    // Abrir modal de edição
    const openEditModal = useCallback((person: Person) => {
        setEditingPerson(person);
        setShowEditModal(true);
    }, []);

    // Colunas para desktop
    const desktopColumns: TableColumn<Person>[] = [
        {
            name: 'Selecionar',
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={selectedParticipants.includes(row.id)}
                    onChange={() => toggleSelection(row.id)}
                    className="w-4 h-4"
                />
            ),
            width: '80px',
        },
        {
            name: 'Foto',
            selector: row => row.photo_url || '',
            cell: row => (
                <img
                    src={row.photo_url || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'}
                    alt={row.name}
                    className="w-10 h-10 rounded-full object-cover border"
                />
            ),
            width: '80px',
        },
        {
            name: 'Nome',
            selector: row => row.name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Email',
            selector: row => row.email || '-',
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Combo',
            cell: row => (
                <button
                    onClick={e => {
                        e.stopPropagation();
                        toggleComboStatus(row);
                    }}
                    title="Alternar combo"
                    className="p-1"
                >
                    <Popcorn
                        size={20}
                        className={row.combo ? 'text-green-500' : 'text-gray-400'}
                    />
                </button>
            ),
            width: '80px',
        },
        {
            name: 'Enviado',
            selector: row => (row.sent ? 'Sim' : 'Não'),
            sortable: true,
            width: '100px',
        },
        {
            name: 'Lido',
            selector: row => (row.read ? 'Sim' : 'Não'),
            sortable: true,
            width: '100px',
        },
        {
            name: 'Ações',
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            openEditModal(row);
                        }}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Editar"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setPersonToDelete(row);
                            setShowConfirmModal(true);
                        }}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Deletar"
                    >
                        <Trash size={16} />
                    </button>
                </div>
            ),
            width: '120px',
            ignoreRowClick: true,
        }
    ];

    // Colunas simplificadas para mobile
    const mobileColumns: TableColumn<Person>[] = [
        {
            name: 'Participantes',
            cell: row => (
                <MobileParticipantCard
                    participant={row}
                    isSelected={selectedParticipants.includes(row.id)}
                    onToggleSelect={() => toggleSelection(row.id)}
                    onEdit={() => openEditModal(row)}
                    onDelete={() => {
                        setPersonToDelete(row);
                        setShowConfirmModal(true);
                    }}
                    onToggleCombo={() => toggleComboStatus(row)}
                />
            ),
            sortable: false,
        }
    ];

    return (
        <main className="pt-[80px] px-4 py-6 bg-gray-50 dark:bg-gray-800 text-gray-800 min-h-[calc(100vh-73px)]">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 dark:text-white">
                Participantes
            </h1>

            {/* Barra de ações e busca */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
                    >
                        <Plus size={18} />
                        <span>{isMobile ? 'Adicionar' : 'Adicionar participante'}</span>
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSelectAll}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm whitespace-nowrap"
                        >
                            {isAllSelected ? "Desmarcar todos" : "Marcar todos"}
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm whitespace-nowrap"
                            disabled={selectedParticipants.length === 0}
                        >
                            {isMobile ? "Excluir" : "Excluir selecionados"}
                        </button>
                    </div>

                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 w-full px-4 py-2 border rounded shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Filtros - versão mobile */}
                {isMobile && (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
                        >
                            <Filter size={16} />
                            <span>Filtros</span>
                        </button>

                        {showFilters && (
                            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                {[
                                    { label: 'Combo', value: comboFilter, setter: setComboFilter },
                                    { label: 'Enviado', value: sentFilter, setter: setSentFilter },
                                    { label: 'Lido', value: readFilter, setter: setReadFilter },
                                ].map(({ label, value, setter }, index) => (
                                    <div key={index} className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</span>
                                        <select
                                            value={value}
                                            onChange={e => setter(e.target.value)}
                                            className="px-2 py-1 border rounded shadow-sm text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        >
                                            <option value="todos">Todos</option>
                                            <option value="sim">Sim</option>
                                            <option value="nao">Não</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Filtros - versão desktop */}
                {!isMobile && (
                    <div className="flex flex-wrap gap-4">
                        {[
                            { label: 'Combo', value: comboFilter, setter: setComboFilter },
                            { label: 'Enviado', value: sentFilter, setter: setSentFilter },
                            { label: 'Lido', value: readFilter, setter: setReadFilter },
                        ].map(({ label, value, setter }, index) => (
                            <div key={index} className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</span>
                                <select
                                    value={value}
                                    onChange={e => setter(e.target.value)}
                                    className="px-2 py-1 border rounded shadow-sm text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="sim">Sim</option>
                                    <option value="nao">Não</option>
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabela/Lista de participantes */}
            {isMobile ? (
                <div className="space-y-3">
                    {filtered.map(participant => (
                        <MobileParticipantCard
                            key={participant.id}
                            participant={participant}
                            isSelected={selectedParticipants.includes(participant.id)}
                            onToggleSelect={() => toggleSelection(participant.id)}
                            onEdit={() => openEditModal(participant)}
                            onDelete={() => {
                                setPersonToDelete(participant);
                                setShowConfirmModal(true);
                            }}
                            onToggleCombo={() => toggleComboStatus(participant)}
                        />
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum participante encontrado
                        </div>
                    )}
                </div>
            ) : (
                <DataTable
                    columns={desktopColumns}
                    data={filtered}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 15, 20]}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    onRowClicked={row => setSelectedPerson(row)}
                    noDataComponent="Nenhum participante encontrado."
                    theme={isDarkMode ? 'dark' : 'default'}
                    customStyles={customStyles}
                />
            )}

            {/* Modal para adicionar participante */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Novo Participante"
                size={isMobile ? 'md' : 'xl'}
            >
                <PersonForm
                    onSave={handleAddPerson}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            {/* Modal de detalhes do participante */}
            <ParticipantDetailsModal
                person={selectedPerson}
                isOpen={!!selectedPerson}
                onClose={() => setSelectedPerson(null)}
                onUpdate={updated => setParticipants(prev =>
                    prev.map(p => (p.id === updated.id ? updated : p))
                )}
            />

            {/* Modal de edição */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Editar Participante"
                size={isMobile ? 'md' : 'lg'}
            >
                {editingPerson && (
                    <PersonEditForm
                        person={editingPerson}
                        onSave={handleUpdatePerson}
                        onCancel={() => setShowEditModal(false)}
                    />
                )}
            </Modal>

            {/* Modal de confirmação de exclusão */}
            {showConfirmModal && personToDelete && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                            Confirmar exclusão
                        </h2>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Tem certeza que deseja excluir <strong>{personToDelete.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (personToDelete?.id) {
                                        handleDeletePerson(personToDelete.id);
                                    }
                                    setShowConfirmModal(false);
                                    setPersonToDelete(null);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmação de exclusão em massa */}
            {showBulkDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">
                            Excluir Participantes
                        </h2>
                        <p className="mb-4 dark:text-gray-300">
                            Você tem certeza de que deseja excluir {selectedParticipants.length} participante(s) selecionado(s)?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowBulkDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmBulkDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};
