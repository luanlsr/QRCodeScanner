import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Illustration from '../assets/undraw_apps.svg';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className=" flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8 text-center"
            style={{ height: 'calc(100vh - 73px)' }}>
            <img
                src={Illustration}
                alt="QR Code Illustration"
                className="w-64 h-64 mb-4"
            />
            <h1 className="text-3xl sm:text-4xl font-bold dark:text-white text-gray-800 mb-4">
                Bem-vindo ao Sistema de QR Code
            </h1>
            <p className="text-gray-600 mb-8 text-lg max-w-xl">
                Gere códigos personalizados para seus convidados ou escaneie para verificar presença.
            </p>

            <div className="flex gap-4 flex-col sm:flex-row">
                <button
                    onClick={() => navigate('/gerar')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    Gerar QR Code
                </button>
                <button
                    onClick={() => navigate('/ler')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                    Ler QR Code
                </button>
            </div>
        </main>
    );
};
