import { useEffect, useState, useCallback } from 'react';
import DataTable, { TableColumn, createTheme } from 'react-data-table-component';
import { getAllParticipants, createParticipant, deleteParticipant, updateParticipant } from '../data/crud';
import { Modal } from '../components/Modal';
import { PersonForm } from '../components/PersonForm';
import { ParticipantDetailsModal } from '../components/ParticipantDetailsModal';
import { Trash, Pencil, QrCode, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { PersonEditForm } from '../components/PersonEditForm';
import { useProtectRoute } from '../hooks/useProtectRout';
import { Person } from '../models/Person';
import { supabase } from '../superbase';
import { MobileParticipantCard } from '../components/MobileParticipantCard';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { formatPhoneNumber } from '../utils/utils';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { ActionBar } from '../components/ActionBar';
import { BulkDeleteModal } from '../components/BulkDeleteModal';
import { createCustomDarkTheme, createCustomStyles } from '../components/datatable/styles';
import { Html5Qrcode } from 'html5-qrcode';
import { FaWhatsapp } from 'react-icons/fa';

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
    const [sentFilter, setSentFilter] = useState<string>('');
    const [readFilter, setReadFilter] = useState<string>('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scannerActive, setScannerActive] = useState<string | null>(null);
    const [successScan, setSuccessScan] = useState<Person | null>(null);
    const [showQrCode, setShowQrCode] = useState<string | null>(null);

    const { t } = useTranslation();

    const isMobile = useMediaQuery('(max-width: 768px)');
    useProtectRoute();

    useEffect(() => {
        createCustomDarkTheme();
    }, []);

    const customStyles = createCustomStyles(isDarkMode);

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
                const matchName = p.name.toLowerCase().includes(lowerSearch) ||
                    p.last_name.toLowerCase().includes(lowerSearch);
                const matchSent = sentFilter === '' || (sentFilter === 'sim' ? p.sent : !p.sent);
                const matchRead = readFilter === '' || (readFilter === 'sim' ? p.read : !p.read);

                return matchName && matchSent && matchRead;
            })
        );
    }, [search, participants, sentFilter, readFilter]);

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

    // Iniciar scanner de QR Code para um participante específico
    const startScanner = useCallback((participantId: string) => {
        if (scannerActive) {
            // Se já está escaneando, pare primeiro
            const scanner = new Html5Qrcode(`reader-${scannerActive}`);
            if (scanner) {
                scanner.stop().then(() => {
                    scanner.clear();
                    setScannerActive(null);
                    setTimeout(() => startScanner(participantId), 500);
                }).catch(err => {
                    console.error("Erro ao parar scanner:", err);
                });
            }
            return;
        }

        setScannerActive(participantId);
        const scannerId = `reader-${participantId}`;
        const scanner = new Html5Qrcode(scannerId, { verbose: false });

        scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 150, height: 150 } },
            (decodedText) => {
                const person = participants.find(p => p.id === decodedText);
                if (person) {
                    scanner.stop().then(() => {
                        scanner.clear();
                        setScannerActive(null);

                        if (!person.read) {
                            const updatedPerson = { ...person, read: true };
                            updateParticipant(updatedPerson.id, updatedPerson).then(result => {
                                setParticipants(prev => prev.map(p =>
                                    p.id === updatedPerson.id ? result : p
                                ));
                                setSuccessScan(updatedPerson);
                                setTimeout(() => setSuccessScan(null), 3000);
                            });
                        } else {
                            toast.success("Ingresso já verificado!");
                        }
                    });
                } else {
                    scanner.stop().then(() => {
                        scanner.clear();
                        setScannerActive(null);
                        toast.error("QR Code não reconhecido!");
                    });
                }
            },
            () => { }
        );
    }, [participants, scannerActive]);

    // Parar scanner ativo
    const stopScanner = useCallback(() => {
        if (scannerActive) {
            const scanner = new Html5Qrcode(`reader-${scannerActive}`);
            scanner.stop().then(() => {
                scanner.clear();
                setScannerActive(null);
            }).catch(err => {
                console.error("Erro ao parar scanner:", err);
            });
        }
    }, [scannerActive]);

    // Compartilhar por WhatsApp
    const shareViaWhatsApp = useCallback((person: Person) => {
        const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${person.id}`;
        const message = encodeURIComponent(
            `🎬 Olá, ${person.name}!\n\n` +
            `📩 Aqui está a sua *confirmação de inscrição* para o evento.\n\n` +
            `🪪 Mostre este QRCode na entrada para acessar o evento.\n\n` +
            `🖼️ Seu QR Code: ${qrLink}\n\n` +
            `🎉 Até lá!`
        );
        window.open(`https://wa.me/${person.phone.replace(/\D/g, '')}?text=${message}`, '_blank');

        // Atualizar o estado "sent" do participante
        const updatedPerson = { ...person, sent: true };
        updateParticipant(person.id, updatedPerson).then(result => {
            setParticipants(prev => prev.map(p => (p.id === person.id ? result : p)));
            toast.success('Mensagem enviada por WhatsApp!');
        });
    }, []);

    // Alternar exibição do QR Code
    const toggleQrCode = useCallback((id: string) => {
        setShowQrCode(prevId => prevId === id ? null : id);
    }, []);

    // Abrir modal de edição
    const openEditModal = useCallback((person: Person) => {
        setEditingPerson(person);
        setShowEditModal(true);
    }, []);

    // Colunas para desktop
    const desktopColumns: TableColumn<Person>[] = [
        {
            name: `${t('participants.table.select')}`,
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
            name: `${t('participants.table.photo')}`,
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
            name: `${t('participants.table.name')}`,
            selector: row => row.name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: `${t('participants.table.lastName')}`,
            selector: row => row.last_name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: `${t('participants.table.phone')}`,
            selector: row => formatPhoneNumber(row.phone),
            sortable: true,
            minWidth: '150px',
        },
        {
            name: `${t('participants.table.email')}`,
            selector: row => row.email || '-',
            sortable: true,
            minWidth: '200px',
        },
        {
            name: `${t('participants.table.sent')}`,
            selector: row => (row.sent ? `${t('participants.table.yes')}` : `${t('participants.table.no')}`),
            sortable: true,
            width: '100px',
        },
        {
            name: `${t('participants.table.read')}`,
            selector: row => (row.read ? `${t('participants.table.yes')}` : `${t('participants.table.no')}`),
            sortable: true,
            width: '100px',
        },
        {
            name: `${t('participants.table.actions')}`,
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            openEditModal(row);
                        }}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title={`${t('participants.table.edit')}`}
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            shareViaWhatsApp(row);
                        }}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        title="Enviar por WhatsApp"
                    >
                        <FaWhatsapp size={16} />
                    </button>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setPersonToDelete(row);
                            setShowConfirmModal(true);
                        }}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        title={`${t('participants.table.delete')}`}
                    >
                        <Trash size={16} />
                    </button>
                </div>
            ),
            width: '180px',
            ignoreRowClick: true,
        }
    ];

    return (
        <main className="pt-[80px] px-4 py-6 bg-gray-50 dark:bg-gray-800 text-gray-800 min-h-[calc(100vh-73px)]">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 dark:text-white">
                {`${t('participants.table.participants')}`}
            </h1>

            {/* Barra de ações e busca */}
            <ActionBar
                isMobile={isMobile}
                search={search}
                setSearch={setSearch}
                setShowAddModal={setShowAddModal}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                isAllSelected={isAllSelected}
                selectedCount={selectedParticipants.length}
                sentFilter={sentFilter}
                setSentFilter={setSentFilter}
                readFilter={readFilter}
                setReadFilter={setReadFilter}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />

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
                            onShowQrCode={(p) => toggleQrCode(p.id)}
                            onSendWhatsApp={shareViaWhatsApp}
                        />
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            {t('participants.table.notFound')}
                        </div>
                    )}
                </div>
            ) : (
                <DataTable
                    columns={desktopColumns}
                    data={filtered}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    onRowClicked={row => setSelectedPerson(row)}
                    noDataComponent={t('participants.table.notFound')}
                    theme={isDarkMode ? 'dark' : 'default'}
                    customStyles={customStyles}
                />
            )}

            {/* Modal para adicionar participante */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={t('participants.actionBar.new')}
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
                title={t('participants.actionBar.edit')}
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
                <ConfirmDeleteModal
                    isOpen={showConfirmModal && !!personToDelete}
                    personName={personToDelete?.name ?? ""}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        if (personToDelete?.id) {
                            handleDeletePerson(personToDelete.id);
                        }
                        setShowConfirmModal(false);
                        setPersonToDelete(null);
                    }}
                />
            )}

            {/* Modal de confirmação de exclusão em massa */}
            {showBulkDeleteModal && (
                <BulkDeleteModal
                    count={selectedParticipants.length}
                    onCancel={() => setShowBulkDeleteModal(false)}
                    onConfirm={handleConfirmBulkDelete}
                />
            )}
        </main>
    );
};
