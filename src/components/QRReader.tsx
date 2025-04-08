// src/components/QRReader.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Person } from '../types';
import toast from 'react-hot-toast';
import { Check, ChevronDown, ChevronUp, Trash } from 'lucide-react';

interface Props {
  data: Person[];
  onUpdatePerson: (person: Person) => void;
}

export const QRReader: React.FC<Props> = ({ data, onUpdatePerson }) => {
  const [scanning, setScanning] = useState(false);
  const [showList, setShowList] = useState(true);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const activeData = data.filter(person => !person.deleted);
  const totalCount = activeData.length;
  const readCount = activeData.filter(p => p.read).length;
  const progress = totalCount > 0 ? (readCount / totalCount) * 100 : 0;

  const filteredData = activeData.filter(person => {
    if (filter === 'read') return person.read;
    if (filter === 'unread') return !person.read;
    return true;
  });

  useEffect(() => {
    const scannerId = "reader";

    if (scanning && !scannerRef.current) {
      const html5QrCode = new Html5Qrcode(scannerId, { verbose: false });
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          const person = activeData.find(p => p.id === decodedText);
          if (person) {
            html5QrCode.stop().then(() => {
              html5QrCode.clear();
              scannerRef.current = null;
              setScanning(false);

              if (!person.read) {
                onUpdatePerson({ ...person, read: true });
                toast.success(`${person.name} verificado com sucesso!`);
              } else {
                toast('Já verificado!');
              }
            }).catch(err => {
              console.error("Erro ao parar scanner:", err);
              toast.error("Erro ao parar scanner.");
            });
          }
        },
        () => {
          // silencioso
        }
      ).catch(err => {
        console.error("Erro ao iniciar scanner:", err);
        toast.error("Erro ao acessar a câmera.");
        scannerRef.current = null;
        setScanning(false);
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .then(() => {
            scannerRef.current = null;
          })
          .catch(err => console.error("Erro ao parar o scanner:", err));
      }
    };
  }, [scanning, activeData, onUpdatePerson]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leitor QR Code</h2>

      {/* Progresso */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">Progresso</span>
          <span className="text-sm font-semibold">{readCount} de {totalCount} lidos</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Botão iniciar/parar */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => {
            // Se já tiver scanner ativo, para e limpa
            if (scanning && scannerRef.current) {
              scannerRef.current.stop()
                .then(() => scannerRef.current?.clear())
                .then(() => {
                  scannerRef.current = null;
                  setScanning(false);
                })
                .catch(err => {
                  console.error("Erro ao parar scanner manualmente:", err);
                  toast.error("Erro ao parar scanner.");
                });
            } else {
              setScanning(true);
            }
          }}
          className={`py-2 px-6 rounded-lg text-white ${scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {scanning ? 'Parar Leitura' : 'Iniciar Leitura'}
        </button>
      </div>

      {/* Scanner */}
      {scanning && <div id="reader" className="w-full max-w-md mx-auto mb-6" />}

      {/* Filtros e lista */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          {showList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <span className="font-semibold">Participantes</span>
        </button>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-1 border rounded-lg bg-white"
        >
          <option value="all">Todos</option>
          <option value="read">Lidos</option>
          <option value="unread">Não lidos</option>
        </select>
      </div>

      {showList && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y">
            {filteredData.map(person => (
              <div
                key={person.id}
                className={`px-4 py-3 flex items-center justify-between ${person.read ? 'bg-green-50' : 'bg-white'}`}
              >
                <div>
                  <h3 className="font-medium">
                    {person.name}
                    {person.read && (
                      <span className="ml-2 text-green-500 text-sm">
                        <Check size={16} className="inline mr-1" />
                        Verificado
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{person.email}</p>
                </div>
                <button
                  onClick={() => onUpdatePerson({ ...person, deleted: true })}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Deletar"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
