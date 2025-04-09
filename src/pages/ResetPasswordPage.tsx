import { useEffect, useState } from 'react';
import { supabase } from '../superbase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            toast.success(`Senha redefinida com sucesso!`);

            if (!data.session) {
                setError("Link expirado ou inválido. Tente novamente.");
            }
        };

        checkSession();
    }, []);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const { data, error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError('Erro ao redefinir senha.');
            toast.error(`Erro ao redefinir senha.`);
        } else {
            setMessage('Senha redefinida com sucesso!');
            toast.success(`Senha redefinida com sucesso!`);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-600 to-indigo-800">
            <form
                onSubmit={handleResetPassword}
                className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Redefinir Senha</h2>

                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                    type="password"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                    Atualizar Senha
                </button>
            </form>
        </div>
    );
};
