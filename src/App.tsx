import React, { useState } from 'react';
import { QRGenerator } from './components/QRGenerator';
import { QRReader } from './components/QRReader';
import { PersonForm } from './components/PersonForm';
import { PersonEditForm } from './components/PersonEditForm';
import { Modal } from './components/Modal';
import { Person } from './types';
import { mockData } from './data';
import { Toaster } from 'react-hot-toast';
import { QrCode, Camera, Plus } from 'lucide-react';

function App() {
  const [data, setData] = useState<Person[]>(mockData);
  const [mode, setMode] = useState<'generate' | 'read'>('generate');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const handleUpdatePerson = (updatedPerson: Person) => {
    setData(data.map(person =>
      person.id === updatedPerson.id ? updatedPerson : person
    ));
  };

  const handleAddPerson = (newPerson: Person) => {
    setData([...data, newPerson]);
    setShowAddModal(false);
  };

  const handleEditPerson = (updatedPerson: Person) => {
    handleUpdatePerson(updatedPerson);
    setShowEditModal(false);
  };

  const handleDeletePerson = (id: string) => {
    setData(data.filter(person => person.id !== id));
  };

  const openEditModal = (person: Person) => {
    setEditingPerson(person);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Modal de Adição */}
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

      {/* Modal de Edição */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Participant"
      >
        {editingPerson && (
          <PersonEditForm
            person={editingPerson}
            onSave={handleEditPerson}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>

      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setMode('generate')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 ${mode === 'generate' ? 'bg-blue-500 text-white' : 'bg-gray-50'
                }`}
            >
              <QrCode size={20} />
              Generate QR
            </button>
            <button
              onClick={() => setMode('read')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 ${mode === 'read' ? 'bg-blue-500 text-white' : 'bg-gray-50'
                }`}
            >
              <Camera size={20} />
              Read QR
            </button>
          </div>
          {/* Botão para abrir modal de adição */}
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
