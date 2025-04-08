import { useState } from 'react';
import { Switch } from '@headlessui/react'; // Importando o Switch

export const SettingsPage = () => {
    const [enabled, setEnabled] = useState(false); // Definindo o estado do Switch (modo escuro, por exemplo)

    const toggleSwitch = () => setEnabled(!enabled); // Função para alternar o estado

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações</h1>

            <div className="space-y-6">
                {/* Switch para alternar entre o modo escuro ou outras opções */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-700">Modo Escuro</span>
                    <Switch
                        checked={enabled} // Se estiver ativado, o Switch será ligado
                        onChange={toggleSwitch} // Função que altera o estado
                        className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out`}
                    >
                        <span
                            className={`${enabled ? 'translate-x-5' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full transition duration-200 ease-in-out`}
                        />
                    </Switch>
                </div>

                {/* Outras configurações podem ser adicionadas aqui */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-700">Outra Configuração</span>
                    <Switch
                        checked={enabled}
                        onChange={toggleSwitch}
                        className={`${enabled ? 'bg-green-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out`}
                    >
                        <span
                            className={`${enabled ? 'translate-x-5' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full transition duration-200 ease-in-out`}
                        />
                    </Switch>
                </div>
            </div>
        </div>
    );
};
