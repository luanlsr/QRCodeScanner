import React, { useEffect, useState } from 'react';
import { QRGenerator } from '../components/QRGenerator';
import { Toaster } from 'react-hot-toast';
import { getAllParticipants, updateParticipant } from '../data/crud';
import { useProtectRoute } from '../hooks/useProtectRout';
import { Person } from '../models/Person';

export const GeneratePage: React.FC = () => {
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
            <div className="bg-gray-100 dark:bg-gray-900 p-8" style={{ height: 'calc(100vh - 73px)' }} >

                <Toaster position="top-right" />
                <div className="max-w-4xl mx-auto py-8">
                    <div className="bg-white rounded-lg shadow-lg mb-6">
                        <QRGenerator
                            data={data}
                            onUpdatePerson={handleUpdatePerson}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
