import React, { useEffect, useState } from 'react';
import { QRReader } from '../components/QRReader';
import { Person } from '../types';
import { getAllParticipants, updateParticipant } from '../data/crud';
import { Toaster } from 'react-hot-toast';
import { useProtectRoute } from '../hooks/useProtectRout';

export const ReadPage: React.FC = () => {
    const [data, setData] = useState<Person[]>([]);
    useProtectRoute();

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
    };

    return (
        <>
            <div className="bg-gray-100 p-8 dark:bg-gray-800" style={{ height: 'calc(100vh - 73px)' }}>
                <Toaster position="top-right" />

                <div className="max-w-4xl mx-auto py-8">
                    <div className="bg-white dark:bg-gray-600 dark:text-white rounded-lg shadow-lg  mb-6">
                        <QRReader data={data} onUpdatePerson={handleUpdatePerson} />
                    </div>
                </div>
            </div>
        </>
    );
};
