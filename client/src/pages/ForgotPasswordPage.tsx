import { useState } from 'react';
import { supabase } from '../superbase';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {

            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError('Erro ao enviar email de redefinição.');
        } else {
            setMessage('Email de redefinição enviado com sucesso!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Esqueceu a senha?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Insira seu email e enviaremos instruções para redefinir sua senha.
                </p>

                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleReset} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};
