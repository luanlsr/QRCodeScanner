import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../superbase';
import { FaGoogle } from 'react-icons/fa';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('Credenciais inválidas');
        } else {
            navigate('/');
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            setError('Erro ao fazer login com o Google');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl grid md:grid-cols-2">
                {/* SOCIAL LOGIN SIDE */}
                <div className="bg-gray-900 text-white p-8 rounded-l-lg hidden md:flex flex-col justify-center space-y-4">
                    <h2 className="text-5xl text-center font-bold mb-2">QR Evento</h2>
                </div>

                {/* FORM SIDE */}
                <div className="p-8">
                    <h2 className="text-3xl text-center font-bold text-gray-800 dark:text-white mb-2">
                        Entrar na sua conta
                    </h2>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="accent-blue-600" />
                                <span>Lembrar-me</span>
                            </label>
                            <a href="/forgot" className="text-blue-500 hover:underline">
                                Esqueceu a senha?
                            </a>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                            >
                                Entrar
                            </button>
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 rounded transition dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            >
                                <FaGoogle className="text-red-500 text-lg" />
                                Entrar com Google
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                            Não tem uma conta?{' '}
                            <a href="/register" className="text-blue-500 hover:underline">
                                Cadastre-se!
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
