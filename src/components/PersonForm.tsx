// PersonForm.tsx
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { Person } from '../types';
import { Check, X } from 'lucide-react';
import validator from 'validator';

interface Props {
    onSave: (data: Omit<Person, 'id'>) => void;
    onCancel: () => void;
}

export const PersonForm: React.FC<Props> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Person, 'id' | 'sent' | 'read' | 'deleted'>>({
        name: '',
        email: '',
        phone: '',
    });

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

        onSave({
            ...formData,
            sent: false,
            read: false,
            deleted: false,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {/* Nome */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Nome</label>
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
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
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
                <label className="block text-gray-700 mb-2" htmlFor="phone">Telefone (com DDI)</label>
                <InputMask
                    mask="+99 (99) 99999-9999"
                    maskChar="_"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                >
                    {(inputProps: any) => (
                        <input
                            {...inputProps}
                            type="tel"
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
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    disabled={!!emailError}
                >
                    <Check size={18} /> Salvar
                </button>
            </div>
        </form>
    );
};
