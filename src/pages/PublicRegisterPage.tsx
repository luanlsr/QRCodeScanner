import React, { useState, useEffect } from 'react';
import { Check, CheckCircle } from 'lucide-react';
import validator from 'validator';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { supabase } from '../superbase';
import toast from 'react-hot-toast';
import { Button } from '@headlessui/react';

export const PublicRegisterPage = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [combo, setCombo] = useState(false);
    const [valor, setValor] = useState(25);
    const [emailError, setEmailError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [participantId, setParticipantId] = useState<string | null>(null);

    useEffect(() => {
        setValor(combo ? 40 : 25);
    }, [combo]);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (!validator.isEmail(value)) {
            setEmailError('Email inválido');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (emailError) return;

        const { data, error } = await supabase.from('participants').insert([
            {
                name,
                last_name: lastName,
                email,
                phone,
                combo,
                valor,
                sent: false,
                read: false,
                deleted: false,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]).select('id').single(); // Isso retorna o ID do novo participante

        if (error) {
            toast.error('Erro ao cadastrar. Tente novamente.');
        } else {
            setParticipantId(data.id);
            setShowSuccess(true);
        }
    };

    const resetForm = () => {
        setName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setCombo(false);
        setShowSuccess(false);
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Inscrição realizada com sucesso!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300">
                        Um email de confirmação foi enviado. Você pode fazer outra inscrição se desejar.
                    </p>
                    <Button onClick={resetForm} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">Fazer nova inscrição</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                    Inscrição para o Evento
                </h2>

                {/* Nome */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="name">Nome</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Primeiro nome"
                        required
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    />
                </div>

                {/* Sobrenome */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="lastName">Sobrenome</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Sobrenome"
                        required
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="email@exemplo.com"
                        required
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>

                {/* Telefone */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="phone">Telefone (com DDI)</label>
                    <PhoneInput
                        country={'br'}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        inputProps={{
                            name: 'phone',
                            required: true,
                        }}
                        inputClass="!w-full !h-10 !bg-white dark:!bg-gray-700 dark:!text-gray-100 dark:!border-gray-600"
                        buttonClass="!border-gray-300 dark:!border-gray-600"
                        containerClass="!w-full"
                        masks={{ br: '(..) .....-....' }}
                    />
                </div>

                {/* Combo */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2">Pagou Combo?</label>
                    <div className="flex gap-4 text-gray-800 dark:text-gray-100">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="combo"
                                value="sim"
                                checked={combo === true}
                                onChange={() => setCombo(true)}
                            />
                            Sim (+ R$ 15)
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="combo"
                                value="nao"
                                checked={combo === false}
                                onChange={() => setCombo(false)}
                            />
                            Não
                        </label>
                    </div>
                </div>

                {/* Valor */}
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="valor">Valor Total (R$)</label>
                    <input
                        type="text"
                        id="valor"
                        value={`R$ ${valor},00`}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded flex justify-center items-center gap-2"
                    disabled={!!emailError}
                >
                    <Check size={18} /> Confirmar Inscrição
                </button>
            </form>
        </div>
    );
};
