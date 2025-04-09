import { useEffect, useState } from 'react';
import DataTable, { TableColumn, createTheme } from 'react-data-table-component';
import { Person } from '../types';
import { getAllParticipants, createParticipant, deleteParticipant, updateParticipant } from '../data/crud';
import { Modal } from '../components/Modal';
import { PersonForm } from '../components/PersonForm';
import { ParticipantDetailsModal } from '../components/ParticipantDetailsModal';
import { Plus, Trash, Pencil, Popcorn } from 'lucide-react';
import toast from 'react-hot-toast';
import { PersonEditForm } from '../components/PersonEditForm';
import { useProtectRoute } from '../hooks/useProtectRout';

export const Participants = () => {
    const [participants, setParticipants] = useState<Person[]>([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState<Person[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [comboFilter, setComboFilter] = useState<string>('todos');
    const [sentFilter, setSentFilter] = useState<string>('todos');
    const [readFilter, setReadFilter] = useState<string>('todos');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useProtectRoute();

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: isDarkMode ? '#374151' : '#f3f4f6', // gray-700 : gray-100
                color: isDarkMode ? '#f9fafb' : '#111827', // gray-50 : gray-900
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
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', // gray-800 : white
                color: isDarkMode ? '#f9fafb' : '#111827', // gray-50 : gray-900
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


    createTheme('dark', {
        text: {
            primary: '#ffffff',
            secondary: '#cccccc',
        },
        background: {
            default: '', // tailwind "gray-800"
        },
        context: {
            background: '#262626',
            text: '#ffffff',
        },
        divider: {
            default: '#374151', // tailwind "gray-700"
        },
        button: {
            default: '#ffffff',
            hover: '#e2e8f0',
            focus: '#e2e8f0',
            disabled: '#9ca3af',
        },
        sortFocus: {
            default: '#3b82f6', // tailwind "blue-500"
        },
    });

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllParticipants();
            setParticipants(data);
            setFiltered(data);
        };
        fetchData();
    }, []);

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

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFiltered(
            participants.filter((p) => {
                const matchName = p.name.toLowerCase().includes(lowerSearch);
                const matchCombo = comboFilter === 'todos' || (comboFilter === 'sim' ? p.combo : !p.combo);
                const matchSent = sentFilter === 'todos' || (sentFilter === 'sim' ? p.sent : !p.sent);
                const matchRead = readFilter === 'todos' || (readFilter === 'sim' ? p.read : !p.read);

                return matchName && matchCombo && matchSent && matchRead;
            })
        );

    }, [search, participants, comboFilter, sentFilter, readFilter]);

    const toggleComboStatus = async (person: Person) => {
        const novoCombo = !person.combo;
        const novoValor = novoCombo ? person.valor + 15 : person.valor - 15;

        const updated = {
            ...person,
            combo: novoCombo,
            valor: novoValor,
        };

        const result = await updateParticipant(updated.id, updated);

        setParticipants((prev) =>
            prev.map((p) => (p.id === updated.id ? result : p))
        );
    };

    const handleAddPerson = async (personData: Omit<Person, 'id'>) => {
        const created = await createParticipant(personData);
        const newList = [...participants, created];
        setParticipants(newList);
        setShowAddModal(false);
    };

    const handleDeletePerson = async (id: string) => {
        await deleteParticipant(id);
        setParticipants((prev) => prev.filter((p) => p.id !== id));
        toast.success('Participante excluído!');
    };


    const handleUpdatePerson = async (updated: Person) => {
        const result = await updateParticipant(updated.id, updated);
        setParticipants(prev => prev.map(p => (p.id === updated.id ? result : p)));
        setShowEditModal(false);
    };

    const openEditModal = (person: Person) => {
        setEditingPerson(person);
        setShowEditModal(true);
    };

    const mobileColumns: TableColumn<Person>[] = [
        {
            name: 'Foto',
            selector: (row) => row.photo_url || '',
            cell: (row) => (
                <img
                    src={row.photo_url || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'}
                    alt={row.name}
                    className="w-12 h-12 rounded-full object-cover border"
                />
            ),
            sortable: false,
        },
        {
            name: 'Nome',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Combo',
            selector: (row) => row.combo ? 'Sim' : 'Não',
            cell: (row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleComboStatus(row);
                    }}
                    title="Alternar combo"
                >
                    <Popcorn
                        size={20}
                        className={row.combo ? 'text-green-500' : 'text-gray-400'}
                    />
                </button>
            ),
            sortable: false,
        },
        {
            name: 'Ações',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openEditModal(row)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Editar"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => {
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
            ignoreRowClick: true,
        }
    ];

    const desktopColumns: TableColumn<Person>[] = [
        ...mobileColumns,
        {
            name: 'Email',
            selector: (row) => row.email || '',
            sortable: true,
        },
        {
            name: 'Enviado',
            selector: (row) => (row.sent ? 'Sim' : 'Não'),
            sortable: true,
        },
        {
            name: 'Lido',
            selector: (row) => (row.read ? 'Sim' : 'Não'),
            sortable: true,
        },

    ];

    return (
        <main className="pt-[80px] px-4 py-6 bg-gray-50 dark:bg-gray-800 text-gray-800" style={{ height: 'calc(100vh - 73px)' }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Participantes</h1>

            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Novo Participante"
                size='xl'
            >
                <PersonForm
                    onSave={handleAddPerson}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            <ParticipantDetailsModal
                person={selectedPerson}
                isOpen={!!selectedPerson}
                onClose={() => setSelectedPerson(null)}
                onUpdate={(updated) =>
                    setParticipants((prev) =>
                        prev.map((p) => (p.id === updated.id ? updated : p))
                    )
                }
            />

            <div className="flex justify-between items-center mb-4 gap-4 flex-wrap ">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    <Plus size={20} /> Adicionar participante
                </button>
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 border rounded shadow-sm w-full sm:max-w-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                {[
                    { label: 'Combo', value: comboFilter, setter: setComboFilter },
                    { label: 'Enviado', value: sentFilter, setter: setSentFilter },
                    { label: 'Lido', value: readFilter, setter: setReadFilter },
                ].map(({ label, value, setter }, index) => (
                    <div key={index} className="flex flex-col w-24 sm:w-auto">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
                        <select
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className="px-2 py-1 border rounded shadow-sm text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="todos">Todos</option>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </div>
                ))}
            </div>

            <DataTable
                columns={isMobile ? mobileColumns : desktopColumns}
                data={filtered}
                pagination
                paginationPerPage={isMobile ? 5 : 10}
                paginationRowsPerPageOptions={isMobile ? [5, 10] : [10, 15, 20]}
                highlightOnHover
                pointerOnHover
                responsive
                onRowClicked={(row) => setSelectedPerson(row)}
                noDataComponent="Nenhum participante encontrado."
                theme={isDarkMode ? 'dark' : 'default'}
                customStyles={customStyles}
            />

            {/* Modal de edição */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Editar Participante"
                size='lg'
            >
                {editingPerson && (
                    <PersonEditForm
                        person={editingPerson}
                        onSave={handleUpdatePerson}
                        onCancel={() => setShowEditModal(false)}
                    />
                )}
            </Modal>

            {/* Modal de confirmação */}
            {showConfirmModal && personToDelete && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Confirmar exclusão</h2>
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
        </main>
    );
};
