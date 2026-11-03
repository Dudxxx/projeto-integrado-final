import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthTokenPayload {
    sub: string;
    email: string;
    nivel: 'USER' | 'ADMIN';
}

export const signAccessToken = (payload: AuthTokenPayload): string =>
    jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] });
