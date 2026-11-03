import 'dotenv/config';

const required = (name: string, fallback?: string): string => {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Variável de ambiente ausente: ${name}`);
    }
    return value;
};

export const env = {
    port: Number(process.env.PORT ?? 4000),
    jwtSecret: required('JWT_SECRET', 'troque-esta-chave-em-producao'),
    jwtExpiresIn: required('JWT_EXPIRES_IN', '2h'),
    db: {
        host: required('DB_HOST', 'db'),
        port: Number(process.env.DB_PORT ?? 3306),
        database: required('DB_NAME', 'barbearia_agenda'),
        user: required('DB_USER', 'barbearia'),
        password: required('DB_PASSWORD', 'barbearia_dev')
    }
} as const;
