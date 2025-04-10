import React, { useState } from 'react';
import validator from 'validator';
import { Check, X } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import { Person } from '../models/Person';

interface Props {
    person: Person;
    onSave: (person: Person) => void;
    onCancel: () => void;
}

export const PersonEditForm: React.FC<Props> = ({ person, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Person>(person);
    const [emailError, setEmailError] = useState('');

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
        onSave({ ...formData, updated_at: new Date() });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {/* Nome */}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="name">
                    Nome
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: João da Silva"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                />
            </div>
            {/* Nome */}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="lastName">
                    Sobrenome
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Ex: João da Silva"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: joao@email.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Telefone com código internacional */}
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="phone">
                    Telefone (com DDI)
                </label>
                <PhoneInput
                    country={'br'}
                    value={formData.phone}
                    onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                    inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: false,
                    }}
                    inputClass="!w-full !h-10 !bg-white dark:!bg-gray-700 !text-black dark:!text-white !border !border-gray-300 dark:!border-gray-600"
                    buttonClass="!border-gray-300 dark:!border-gray-600"
                    containerClass="!w-full"
                    masks={{ br: '(..) .....-....' }}
                />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                    <X size={18} /> Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!!emailError}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <Check size={18} /> Atualizar
                </button>
            </div>
        </form>
    );
};
