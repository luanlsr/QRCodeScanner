import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <img
                src="https://undraw.co/api/illustrations/97f24749-33a3-41cc-9982-8c75d24f918c" // QR Code illustration
                alt="QR Code Illustration"
                className="w-full max-w-md mb-8"
            />

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Bem-vindo ao Sistema de QR Code
            </h1>
            <p className="text-gray-600 mb-8 text-lg max-w-xl">
                Gere códigos personalizados para seus convidados ou escaneie para verificar presença com facilidade.
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
        </div>
    );
};
