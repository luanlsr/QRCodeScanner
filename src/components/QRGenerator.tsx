import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Mail, Send, Edit, Trash, QrCode } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Person } from '../types';
import toast from 'react-hot-toast';

interface Props {
  data: Person[];
  onUpdatePerson: (person: Person) => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (id: string) => void;
}

export const QRGenerator: React.FC<Props> = ({
  data,
  onUpdatePerson,
  onEditPerson,
  onDeletePerson
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSendWhatsApp = (person: Person) => {
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${person.id}`;
    const message = encodeURIComponent(
      `🎬 Olá, ${person.name}!\n\n` +
      `📩 Aqui está a sua *confirmação de inscrição* para assistir *The Chosen* no *Kinoplex São Luiz*.\n\n` +
      `🪪 Mostre este QRCode para o pessoal da *Federação da UMP* para acessar a sessão.\n\n` +
      `🖼️ Seu QR Code: ${qrLink}\n\n` +
      `🍿 Bom filme! 🎉`
    );
    window.open(`https://wa.me/${person.phone}?text=${message}`, '_blank');
    onUpdatePerson({ ...person, sent: true });
    toast.success(`WhatsApp enviado para ${person.name}`);
  };

  const handleBulkSend = () => {
    if (selectedIds.size === 0) {
      toast.error('Nenhum participante selecionado.');
      return;
    }

    const selectedPeople = data.filter(p => selectedIds.has(p.id));
    selectedPeople.forEach(person => {
      handleSendWhatsApp(person);
    });

    setSelectedIds(new Set()); // limpa a seleção após envio
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedIds.size === data.length && data.length > 0}
            onChange={() => {
              if (selectedIds.size === data.length) {
                setSelectedIds(new Set()); // desmarcar todos
              } else {
                setSelectedIds(new Set(data.map(p => p.id))); // marcar todos
              }
            }}
            className="w-5 h-5 accent-blue-600"
          />
          <h2 className="text-2xl font-bold">Gerador de QRCode</h2>
        </div>

        <button
          onClick={handleBulkSend}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          disabled={selectedIds.size === 0}
        >
          <FaWhatsapp size={18} />
          Enviar WhatsApp em Massa
        </button>
      </div>

      <div className="grid gap-4">
        {data.map((person) => (
          <div
            key={person.id}
            className={`p-4 border rounded-lg transition-colors ${person.sent
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(person.id)}
                  onChange={() => toggleSelect(person.id)}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <h3 className="font-semibold">{person.name}</h3>
                  <p className="text-sm text-gray-600">{person.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSendWhatsApp(person)}
                  className={`p-2 rounded-full ${person.sent
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-500'
                    }`}
                  title="Enviar WhatsApp"
                >
                  <FaWhatsapp size={20} />
                </button>
                <button
                  onClick={() => setSelectedPerson(
                    selectedPerson?.id === person.id ? null : person
                  )}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  title="Mostrar QR Code"
                >
                  <QrCode size={20} />
                </button>
                <button
                  onClick={() => onEditPerson(person)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => person.id && onDeletePerson(person.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  title="Deletar"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>

            {selectedPerson?.id === person.id && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <QRCode value={person.id} size={128} />
                <p className="text-sm text-gray-500">ID: {person.id}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
