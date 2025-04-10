import { useState } from 'react';

export const useCurrency = (initialValue = '') => {
    const [formattedValue, setFormattedValue] = useState(initialValue);

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        const floatValue = (parseInt(numericValue || '0', 10) / 100).toFixed(2);
        return `R$ ${floatValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setFormattedValue(formatCurrency(input));
    };

    const getRawValue = () => {
        return parseFloat(formattedValue.replace(/\D/g, '')) / 100;
    };

    return {
        formattedValue,
        handleChange,
        getRawValue,
        setFormattedValue, // opcional, caso queira setar manualmente
    };
};
