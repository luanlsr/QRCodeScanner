import { useState } from 'react';
import { supabase } from '../superbase';
import toast from 'react-hot-toast';

const options = [
    { id: 'profile', label: 'Perfil' },
    { id: 'notifications', label: 'Notificações' },
    { id: 'password', label: 'Trocar Senha' },
    { id: 'preferences', label: 'Preferências' },
    { id: 'security', label: 'Segurança' },
];

export const SettingsPage = () => {
    const [selected, setSelected] = useState('profile');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {
        setMessage('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage('Preencha todos os campos.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('As senhas novas não coincidem.');
            return;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
            setMessage('Sessão inválida.');
            toast.error('Sessão inválida.')

            return;
        }

        const user = sessionData.session.user;
        const email = user.email;

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email!,
            password: currentPassword,
        });

        if (signInError) {
            setMessage('Senha atual incorreta.');
            toast.error('Senha atual incorreta.')

            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setMessage(`Erro ao atualizar: ${error.message}`);
        } else {
            setMessage('Senha alterada com sucesso!');
            toast.success('Senha alterada com sucesso!')
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300 p-4 sm:p-8 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl flex flex-col sm:flex-row">

                {/* MENU: Sidebar no desktop / stack de botões no mobile */}
                <aside className="border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                    {/* Mobile: empilhado em colunas */}
                    <div className="flex flex-wrap sm:hidden p-2 gap-2 justify-center">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                className={`px-3 py-2 rounded text-sm font-medium ${selected === opt.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setSelected(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop: sidebar vertical */}
                    <div className="hidden sm:flex sm:flex-col sm:w-48 p-4 gap-2">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                className={`text-left px-3 py-2 rounded text-sm font-medium ${selected === opt.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setSelected(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* CONTEÚDO */}
                <main className="flex-1 p-4 sm:p-6">
                    {selected === 'profile' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Perfil</h2>
                            <p className="text-gray-600 dark:text-gray-300">Informações básicas do perfil.</p>
                        </div>
                    )}

                    {selected === 'notifications' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Notificações</h2>
                            <p className="text-gray-600 dark:text-gray-300">Preferências de notificações.</p>
                        </div>
                    )}

                    {selected === 'password' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Trocar Senha</h2>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Senha atual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                                <input
                                    type="password"
                                    placeholder="Nova senha"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                                <button
                                    onClick={handleChangePassword}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Atualizar senha
                                </button>
                                {message && (
                                    <p
                                        className={`text-sm mt-2 ${message.includes('sucesso') ? 'text-green-600' : 'text-red-500'
                                            }`}
                                    >
                                        {message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {selected === 'preferences' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Preferências</h2>
                            <p className="text-gray-600 dark:text-gray-300">Ajustes gerais do sistema.</p>
                        </div>
                    )}

                    {selected === 'security' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Segurança</h2>
                            <p className="text-gray-600 dark:text-gray-300">Configurações de segurança adicionais.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
