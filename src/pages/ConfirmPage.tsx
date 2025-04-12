// src/pages/ConfirmPage.tsx
import { Link } from 'react-router-dom';

export const ConfirmPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <img
                src="https://undraw.co/api/illustrations/2eac1112-29c4-4cf6-8422-ecc8b662bfbf" // você pode trocar por outra da undraw
                alt="Confirmação"
                className="w-64 mb-6"
            />
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Inscrição confirmada!</h1>
            <p className="text-gray-700 max-w-md mb-6">
                Obrigado por se inscrever no evento. Enviamos um e-mail com seu QR Code para o endereço informado.
            </p>
            <Link
                to="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
            >
                Voltar à Página Inicial
            </Link>
        </div>
    );
};
