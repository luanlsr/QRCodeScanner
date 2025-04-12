// src/components/QRReader.tsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { AlertTriangle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Person } from '../models/Person';
import { useTranslation } from 'react-i18next';

interface Props {
  data: Person[];
  onUpdatePerson: (person: Person) => void;
}

export const QRReader: React.FC<Props> = ({ data, onUpdatePerson }) => {
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(false);
  const [showList, setShowList] = useState(true);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [successPerson, setSuccessPerson] = useState<Person | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const activeData = data.filter(person => !person.deleted);
  const totalCount = activeData.length;
  const readCount = activeData.filter(p => p.read).length;
  const progress = totalCount > 0 ? (readCount / totalCount) * 100 : 0;

  const filteredData = useMemo(() => {
    return data.filter(person => {
      const matchesStatus =
        (filter === 'read' && person.read) ||
        (filter === 'unread' && !person.read) ||
        filter === 'all';

      const matchesName = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.last_name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesName;
    });
  }, [data, filter, searchTerm]);


  useEffect(() => {
    const scannerId = 'reader';

    if (scanning && !scannerRef.current) {
      const html5QrCode = new Html5Qrcode(scannerId, { verbose: false });
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: 'environment' },
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
                setSuccessPerson(person);
              } else {
                toast(t('reader.verified'));
              }
            });
          } else {
            html5QrCode.stop().then(() => {
              html5QrCode.clear();
              scannerRef.current = null;
              setScanning(false);
              setErrorMessage(t('reader.scanErrorMessage'));
            });
          }
        },
        () => { }
      );
    }
  }, [scanning, activeData, onUpdatePerson, t]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('reader.title')}</h2>

      {/* Progresso */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">{t('reader.progress')}</span>
          <span className="text-sm font-semibold">
            {t('reader.scanned', { readCount, totalCount })}
          </span>
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
            if (scanning && scannerRef.current) {
              scannerRef.current.stop()
                .then(() => scannerRef.current?.clear())
                .then(() => {
                  scannerRef.current = null;
                  setScanning(false);
                })
                .catch(err => {
                  console.error("Erro ao parar scanner manualmente:", err);
                  toast.error(t('reader.stopError'));
                });
            } else {
              setScanning(true);
            }
          }}
          className={`py-2 px-6 rounded-lg text-white ${scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {scanning ? t('reader.stopScan') : t('reader.startScan')}
        </button>
      </div>

      {/* Scanner */}
      {scanning && <div id="reader" className="w-full max-w-md mx-auto mb-6" />}

      {/* Filtro */}
      <button
        onClick={() => setFilter('all')}
        className={`px-3 py-1 rounded-full text-sm mr-3 mb-3 font-medium border ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
      >
        {t('reader.all')} {data.length}
      </button>
      <button
        onClick={() => setFilter('read')}
        className={`px-3 py-1 rounded-full text-sm mr-3 mb-3 font-medium border ${filter === 'read' ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
      >
        {t('reader.read')} {data.filter(x => x.read).length}
      </button>
      <button
        onClick={() => setFilter('unread')}
        className={`px-3 py-1 rounded-full text-sm mr-3 mb-3 font-medium border ${filter === 'unread' ? 'bg-yellow-500 text-white' : 'bg-white text-yellow-600'}`}
      >
        {t('reader.unread')} {data.filter(x => !x.read).length}
      </button>
      <input
        type="text"
        placeholder={t('generator.searchByName') || "Buscar por nome"}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-1 rounded-4 mb-3 text-sm border border-gray-300 dark:bg-gray-700 dark:text-white"
        style={{ minWidth: '200px' }}
      />

      {/* Lista de participantes */}
      <div className="rounded-xl shadow mb-6 text-white bg-blue-500">
        <div
          className="flex justify-between items-center px-4 py-3 cursor-pointer border-b"
          onClick={() => setShowList(!showList)}
        >
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {showList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            {t('reader.participants')}
          </h3>
        </div>

        {showList && (
          <div className="divide-y">
            {filteredData.map(person => (
              <div
                key={person.id}
                className={`px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${person.read ? 'bg-green-50 dark:bg-gray-200' : 'bg-white dark:bg-gray-800 dark:text-white'}`}
              >
                <div className="sm:max-w-[70%]">
                  <h4 className={`font-medium text-gray-600 break-words ${person.read ? 'dark:text-gray-600' : 'text-gray-600 dark:text-white'}`}>
                    {person.name} {person.last_name}
                    {person.read && (
                      <span className="ml-2 text-green-500 text-sm">
                        <Check size={16} className="inline mr-1" />
                        {t('reader.verified')}
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 break-words dark:text-gray-400 dark:text-white">{person.email}</p>
                </div>

                <button
                  onClick={() => onUpdatePerson({ ...person, read: !person.read })}
                  className={`text-sm px-3 py-1 rounded-lg font-medium whitespace-nowrap self-start sm:self-auto ${person.read
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:text-white dark:bg-yellow-600'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 dark:text-white dark:bg-green-900'
                    }`}
                >
                  {person.read ? t('reader.markAsUnread') : t('reader.markAsRead')}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal de sucesso */}
        {successPerson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-green-500 text-white rounded-none sm:rounded-2xl p-6 w-full h-full sm:max-w-md sm:h-auto mx-auto shadow-lg text-center flex flex-col items-center justify-center">
              <Check className="mb-4" size={56} />
              <h2 className="text-2xl font-bold mb-2">{t('reader.scanSuccessTitle')}</h2>
              <p className="text-lg font-medium">{successPerson.name}</p>
              <button
                onClick={() => setSuccessPerson(null)}
                className="mt-6 px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100"
              >
                {t('reader.close')}
              </button>
            </div>
          </div>
        )}

        {/* Modal de erro */}
        {errorMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-red-600 text-white rounded-none sm:rounded-2xl p-6 w-full h-full sm:max-w-md sm:h-auto mx-auto shadow-lg text-center flex flex-col items-center justify-center">
              <AlertTriangle className="mb-4" size={56} />
              <h2 className="text-2xl font-bold mb-2">{t('reader.scanErrorTitle')}</h2>
              <p className="text-lg font-medium">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-6 px-6 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100"
              >
                {t('reader.close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
