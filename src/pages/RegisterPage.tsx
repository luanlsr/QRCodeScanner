import { useState } from 'react';
import { supabase } from '../superbase';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useToast } from '../hooks/useToast';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [erro, setError] = useState('');
    const { success, error } = useToast();

    const isLocalhost = window.location.hostname === 'localhost';
    const navigate = useNavigate();
    const redirectUrl = isLocalhost
        ? 'http://localhost:5173'
        : 'https://qr-code-scanner-ecru.vercel.app';

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl,
            },
        });
        console.log('error: ', error);


        if (error) {
            if (error.message.includes('already registered') || error.message.includes('User already registered')) {
                setError('E-mail já está cadastrado!');
            } else {
                setError('Erro ao cadastrar usuário.');
            }
        } else {
            setMessage('Cadastro realizado!');

            success('Cadastro realizado com sucesso!');
            navigate('/login');
        }
    };

    const handleGoogleSignup = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            setError('Erro ao cadastrar com o Google');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Criar Conta</h2>

                {message && <p className="text-green-500">{message}</p>}
                {erro && <p className="text-red-500">{erro}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
                    >
                        Criar Conta
                    </button>
                </form>

                <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">ou</span>
                </div>

                <button
                    onClick={handleGoogleSignup}
                    className="flex items-center justify-center gap-2 bg-white text-gray-900 font-medium px-4 py-2 w-full rounded hover:bg-gray-100 transition"
                >
                    <FaGoogle className="text-red-500 text-lg" />
                    Cadastrar com Google
                </button>
            </div>
        </div>
    );
};
