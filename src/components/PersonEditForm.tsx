import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import validator from 'validator';
import { Person } from '../types';
import { Check, X } from 'lucide-react';

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
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {/* Nome */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                    Nome
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Telefone com código internacional */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                    Telefone (com DDI)
                </label>
                <InputMask
                    mask="+55 (99) 99999-9999"
                    value={formData.phone}
                    onChange={handleChange}
                    name="phone"
                >
                    {(inputProps: any) => (
                        <input
                            {...inputProps}
                            type="tel"
                            id="phone"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />
                    )}
                </InputMask>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                    <X size={18} /> Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!!emailError}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                    <Check size={18} /> Atualizar
                </button>
            </div>
        </form>
    );
};
