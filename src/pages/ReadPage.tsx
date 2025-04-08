import React, { useEffect, useState } from 'react';
import { QRReader } from '../components/QRReader';
import { Person } from '../types';
import { getAllParticipants, updateParticipant } from '../data/crud';
import { Toaster } from 'react-hot-toast';
import { Header } from '../components/Header';

export const ReadPage: React.FC = () => {
    const [data, setData] = useState<Person[]>([]);

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
            <div className="min-h-screen bg-gray-100 p-8">
                <Toaster position="top-right" />

                <div className="max-w-4xl mx-auto py-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                        <QRReader data={data} onUpdatePerson={handleUpdatePerson} />
                    </div>
                </div>
            </div>
        </>
    );
};
