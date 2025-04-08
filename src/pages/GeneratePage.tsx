import React, { useEffect, useState } from 'react';
import { QRGenerator } from '../components/QRGenerator';
import { PersonEditForm } from '../components/PersonEditForm';
import { Modal } from '../components/Modal';
import { Toaster } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { Person } from '../types';
import { deleteParticipant, getAllParticipants, updateParticipant } from '../data/crud';

export const GeneratePage: React.FC = () => {
    const [data, setData] = useState<Person[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const participants = await getAllParticipants();
            setData(participants);
        };
        fetchData();
    }, []);


    const handleUpdatePerson = async (updated: Person) => {
        const result = await updateParticipant(updated.id, updated);
        setData(prev => prev.map(p => (p.id === updated.id ? result : p)));
        setShowEditModal(false);
    };

    const handleDeletePerson = async (id: string) => {
        await deleteParticipant(id);
        setData(prev => prev.filter(p => p.id !== id));
    };

    const openEditModal = (person: Person) => {
        setEditingPerson(person);
        setShowEditModal(true);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-8">

                <Toaster position="top-right" />

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

                <div className="max-w-4xl mx-auto py-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                        <QRGenerator
                            data={data}
                            onUpdatePerson={handleUpdatePerson}
                            onEditPerson={openEditModal}
                            onDeletePerson={handleDeletePerson}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
