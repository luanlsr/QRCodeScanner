import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Edit, Trash, QrCode, ChevronUp, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Person } from '../models/Person';
import { useTranslation } from 'react-i18next';

interface Props {
  data: Person[];
  onUpdatePerson: (person: Person) => void;
}

export const QRGenerator: React.FC<Props> = ({
  data,
  onUpdatePerson,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showList, setShowList] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'unsent'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { t } = useTranslation();

  const filteredData = data.filter(person => {
    if (filter === 'sent') return person.sent;
    if (filter === 'unsent') return !person.sent;
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSendWhatsApp = (person: Person) => {
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${person.id}`;
    const message = encodeURIComponent(
      t('generator.whatsappMessage', {
        name: person.name,
        qrLink: qrLink,
      })
    );
    window.open(`https://wa.me/${person.phone}?text=${message}`, '_blank');
    onUpdatePerson({ ...person, sent: true });
    toast.success(t('generator.whatsappSent', { name: person.name }));
  };

  return (
    <div className="p-4 sm:p-4 lg:p-10 max-w-4xl w-full mx-auto dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 ">
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center gap-2 text-gray-700 dark:text-white hover:text-gray-900"
        >
          {showList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <h2 className="text-2xl font-bold dark:text-whiate">{t('generator.participantsList')}</h2>
        </button>

        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
          >
            {t('generator.all')} {data.length}
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${filter === 'sent' ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
          >
            {t('generator.sent')} {data.filter(x => x.sent).length}
          </button>
          <button
            onClick={() => setFilter('unsent')}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${filter === 'unsent' ? 'bg-yellow-500 text-white' : 'bg-white text-yellow-600'}`}
          >
            {t('generator.unsent')} {data.filter(x => !x.sent).length}
          </button>
        </div>
      </div>

      {showList && (
        <div className="grid gap-4 w-full">
          {paginatedData.map((person) => (
            <div
              key={person.id}
              className={`p-4 border rounded-lg transition-colors w-full ${person.sent
                ? 'bg-green-50 border-green-200 dark:bg-gray-800'
                : 'bg-white dark:bg-gray-600 border-gray-200'
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 dark:text-white">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold break-words">{person.name} {person.last_name}</h3>
                  <p className="text-sm dark:text-white text-gray-600 break-words">{person.email}</p>
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => handleSendWhatsApp(person)}
                    className={`p-2 rounded-full ${person.sent
                      ? 'bg-green-100 text-green-600 dark:bg-gray-800 dark:text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white hover:bg-green-50 hover:text-green-500'
                      }`}
                    title={t('generator.sendWhatsApp')}
                  >
                    <FaWhatsapp size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedPerson(selectedPerson?.id === person.id ? null : person)
                    }
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                    title={t('generator.showQRCode')}
                  >
                    <QrCode size={20} />
                  </button>
                </div>
              </div>

              {selectedPerson?.id === person.id && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <QRCode value={person.id} size={128} />
                  <p className="text-sm text-gray-500 dark:text-white break-words">
                    {t('generator.idLabel')}: {person.id}
                  </p>
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-600dark:text-white text-gray-700 rounded disabled:opacity-50"
              >
                {t('generator.prevPage')}
              </button>
              <span className="text-sm text-gray-600 dark:text-white">
                {t('generator.page')} {currentPage} {t('generator.of')} {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-600dark:text-white text-gray-700 rounded disabled:opacity-50"
              >
                {t('generator.nextPage')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
