import React, { useState, useEffect } from 'react';
import { Person } from '../types';
import { Check, X } from 'lucide-react';
import validator from 'validator';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface Props {
    onSave: (data: Omit<Person, 'id'>) => void;
    onCancel: () => void;
}

export const PersonForm: React.FC<Props> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Person, 'id' | 'sent' | 'read' | 'deleted' | 'valor' | 'combo'>>({
        name: '',
        email: '',
        phone: '',
    });

    const [emailError, setEmailError] = useState('');
    const [combo, setCombo] = useState(false);
    const [valor, setValor] = useState(25);

    // Atualiza o valor ao mudar o combo
    useEffect(() => {
        setValor(combo ? 40 : 25);
    }, [combo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'email') {
            if (!validator.isEmail(value)) {
                setEmailError('Email inválido');
            } else {
                setEmailError('');
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailError) return;

        onSave({
            ...formData,
            combo,
            valor,
            sent: false,
            read: false,
            deleted: false,
            created_at: new Date,
            updated_at: new Date
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {/* Nome */}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="name">Nome</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Ex: João da Silva"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    required
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ex: joao@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    required
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Telefone */}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="phone">Telefone (com DDI)</label>
                <PhoneInput
                    country={'br'}
                    value={formData.phone}
                    onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                    inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: false,
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
                    name="valor"
                    value={`R$ ${valor},00`}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 cursor-not-allowed"
                />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                    <X size={18} /> Cancelar
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    disabled={!!emailError}
                >
                    <Check size={18} /> Salvar
                </button>
            </div>
        </form>
    );
};
