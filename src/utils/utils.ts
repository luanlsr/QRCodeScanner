export const formatPhoneNumber = (phone: string) => {
    if (!phone) return '-';

    const digits = phone.replace(/\D/g, '');

    // Para números com DDI + DDD + celular: ex: 5521988121305
    if (digits.length === 13) {
        const ddi = digits.slice(0, 2);
        const ddd = digits.slice(2, 4);
        const part1 = digits.slice(4, 9);
        const part2 = digits.slice(9, 13);
        return `+${ddi} (${ddd}) ${part1}-${part2}`;
    }

    // Para celular nacional: ex: 21988121305
    if (digits.length === 11) {
        const ddd = digits.slice(0, 2);
        const part1 = digits.slice(2, 7);
        const part2 = digits.slice(7, 11);
        return `(${ddd}) ${part1}-${part2}`;
    }

    // Para fixo nacional: ex: 2123456789
    if (digits.length === 10) {
        const ddd = digits.slice(0, 2);
        const part1 = digits.slice(2, 6);
        const part2 = digits.slice(6, 10);
        return `(${ddd}) ${part1}-${part2}`;
    }

    return phone; // fallback
};
