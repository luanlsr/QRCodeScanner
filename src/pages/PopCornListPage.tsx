import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../models/Person';
import { getAllParticipants } from '../data/crud';
import { Popcorn } from 'lucide-react';

export default function PopCornListPage() {
    const [participants, setParticipants] = useState<Person[]>([]);
    const [deliveredState, setDeliveredState] = useState<{ [key: string]: boolean }>({});
    const [showCombo, setShowCombo] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllParticipants();
            setParticipants(data);
        };
        fetchData();
    }, []);

    const filteredParticipants = useMemo(() => {
        return participants.filter(person => {
            const matchesName = person.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCombo = person.combo === showCombo;
            return matchesName && matchesCombo;
        });
    }, [participants, searchTerm, showCombo]);

    const handleToggleDelivered = (id: string) => {
        setDeliveredState(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-4 text-center dark:text-white">
                Lista de Participantes com Combo
            </h1>

            <div className="mb-4 flex justify-center space-x-4">
                <button
                    className={`px-6 py-2 rounded-lg ${showCombo ? 'bg-green-500' : 'bg-gray-300'} text-white`}
                    onClick={() => setShowCombo(true)}
                >
                    Combos
                </button>
                <button
                    className={`px-6 py-2 rounded-lg ${!showCombo ? 'bg-red-500' : 'bg-gray-300'} text-white`}
                    onClick={() => setShowCombo(false)}
                >
                    Sem Combos
                </button>
            </div>

            <div className="mb-4 flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar por nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 rounded-3 text-sm border border-gray-300 dark:bg-gray-700 dark:text-white"
                    style={{ minWidth: '200px' }}
                />
            </div>

            <div className="space-y-4">
                {filteredParticipants.length > 0 ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:text-white">
                        {filteredParticipants.map(person => (
                            <div
                                key={person.id}
                                className={`flex items-center justify-between p-4 rounded-lg shadow-lg 
                                ${deliveredState[person.id] ? 'bg-gray-300' : 'bg-white dark:bg-gray-800'}`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Popcorn
                                        size={20}
                                        className={person.combo ? 'text-green-500' : 'text-gray-400'}
                                    />
                                    <div className="text-lg font-semibold">
                                        {person.name} {person.last_name}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleDelivered(person.id)}
                                    className={`px-4 py-2 text-sm rounded-lg 
                                    ${deliveredState[person.id] ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                                >
                                    {deliveredState[person.id] ? 'Entregue' : 'Entregar'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Nenhum participante encontrado.
                    </p>
                )}
            </div>
        </div>
    );
}
