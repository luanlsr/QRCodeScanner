import React, { useEffect, useState } from 'react';
import { QRGenerator } from './components/QRGenerator';
import { QRReader } from './components/QRReader';
import { PersonForm } from './components/PersonForm';
import { PersonEditForm } from './components/PersonEditForm';
import { Modal } from './components/Modal';
import { Toaster } from 'react-hot-toast';
import { QrCode, Camera, Plus } from 'lucide-react';
import { Person } from './types';
import { createParticipant, deleteParticipant, getAllParticipants, updateParticipant } from './data/crud';


function App() {
  const [data, setData] = useState<Person[]>([]);
  const [mode, setMode] = useState<'generate' | 'read'>('generate');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participants = await getAllParticipants();
        setData(participants);
      } catch (error) {
        console.error('Erro ao buscar participantes:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddPerson = async (personData: Omit<Person, "id">) => {
    try {
      const created = await createParticipant(personData);
      setData(prev => [...prev, created]);
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Erro ao adicionar participante:', error);
      alert(`Erro ao salvar participante: ${error.message || error}`);
    }
  };

  const handleUpdatePerson = async (updated: Person) => {
    try {
      const result = await updateParticipant(updated.id, updated);
      setData(prev => prev.map(p => (p.id === updated.id ? result : p)));
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Erro ao atualizar participante:', error);
      alert(`Erro ao atualizar participante: ${error.message || error}`);
    }
  };


  const handleDeletePerson = async (id: string) => {
    try {
      await deleteParticipant(id);
      setData(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao deletar participante:', error);
    }
  };

  const openEditModal = (person: Person) => {
    setEditingPerson(person);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white py-6 px-4 shadow-md border-b border-blue-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center font-sans tracking-wide">
          🎫 Gerenciador de Eventos da Federação da UMP
        </h1>
      </div>
      <Toaster position="top-right" />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Participant"
      >
        <PersonForm
          onSave={handleAddPerson}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Participant"
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
          <div className="flex border-b">
            <button
              onClick={() => setMode('generate')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 ${mode === 'generate' ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}
            >
              <QrCode size={20} />
              Gerar QR
            </button>
            <button
              onClick={() => setMode('read')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 ${mode === 'read' ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}
            >
              <Camera size={20} />
              Ler QR
            </button>
          </div>

          {mode === 'generate' && (
            <div className="flex justify-end px-6 py-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus size={20} /> Add Participant
              </button>
            </div>
          )}

          {mode === 'generate' ? (
            <QRGenerator
              data={data}
              onUpdatePerson={handleUpdatePerson}
              onEditPerson={openEditModal}
              onDeletePerson={handleDeletePerson}
            />
          ) : (
            <QRReader data={data} onUpdatePerson={handleUpdatePerson} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
