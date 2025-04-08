import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Person } from '../types';
import { getAllParticipants, createParticipant } from '../data/crud';
import { Modal } from '../components/Modal';
import { PersonForm } from '../components/PersonForm';
import { ParticipantDetailsModal } from '../components/ParticipantDetailsModal';
import { Plus } from 'lucide-react';

export const Participants = () => {
    const [participants, setParticipants] = useState<Person[]>([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState<Person[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    const [isMobile, setIsMobile] = useState(false);

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
        const lowerSearch = search.toLowerCase();
        setFiltered(
            participants.filter((p) =>
                p.name.toLowerCase().includes(lowerSearch)
            )
        );
    }, [search, participants]);

    const handleAddPerson = async (personData: Omit<Person, 'id'>) => {
        const created = await createParticipant(personData);
        const newList = [...participants, created];
        setParticipants(newList);
        setShowAddModal(false);
    };

    const mobileColumns: TableColumn<Person>[] = [
        {
            name: 'Foto',
            selector: (row) => row.photoUrl || '',
            cell: (row) => (
                <img
                    src={row.photoUrl || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'}
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
        <main className="pt-[80px] px-4 py-6 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Participantes</h1>

            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Novo Participante"
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

            <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 border rounded shadow-sm w-full sm:max-w-sm"
                />
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    <Plus size={20} /> Adicionar participante
                </button>
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
            />
        </main>
    );
};
