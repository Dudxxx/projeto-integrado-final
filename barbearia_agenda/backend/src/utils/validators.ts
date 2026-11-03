import { ValidationError } from '../errors/AppError.js';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeCpf = (value: string): string => value.replace(/\D/g, '');

export const isValidCpf = (value: string): boolean => {
    const cpf = normalizeCpf(value);
    if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;

    const calcDigit = (slice: string, factor: number): number => {
        const sum = [...slice].reduce((total, digit, index) => total + Number(digit) * (factor - index), 0);
        const rest = (sum * 10) % 11;
        return rest === 10 ? 0 : rest;
    };

    const first = calcDigit(cpf.slice(0, 9), 10);
    const second = calcDigit(cpf.slice(0, 10), 11);
    return first === Number(cpf[9]) && second === Number(cpf[10]);
};

export const assertEmail = (email: string): string => {
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) throw new ValidationError('E-mail inválido.');
    return normalized;
};

export const assertPassword = (password: string): void => {
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!strong.test(password)) {
        throw new ValidationError('A senha deve ter 8+ caracteres, maiúscula, minúscula, número e símbolo.');
    }
};

export const assertCpf = (cpf: string): string => {
    const normalized = normalizeCpf(cpf);
    if (!isValidCpf(normalized)) throw new ValidationError('CPF inválido.');
    return normalized;
};

export const assertRequiredText = (value: string, field: string, min = 1): string => {
    const text = value.trim();
    if (text.length < min) throw new ValidationError(`Campo ${field} é obrigatório.`);
    return text;
};

export const assertPositiveNumber = (value: number, field: string): number => {
    if (!Number.isFinite(value) || value < 0) throw new ValidationError(`${field} inválido.`);
    return value;
};

export const assertPositiveInteger = (value: number, field: string): number => {
    if (!Number.isInteger(value) || value <= 0) throw new ValidationError(`${field} inválido.`);
    return value;
};
