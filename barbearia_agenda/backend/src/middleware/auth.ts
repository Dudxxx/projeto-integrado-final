import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError.js';

interface TokenPayload extends JwtPayload {
    email: string;
    nivel: 'USER' | 'ADMIN';
}

const extractBearer = (request: Request): string => {
    const header = request.header('authorization');
    if (!header?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token de acesso não informado.');
    }
    return header.slice(7);
};

export const requireAuth = (request: Request, _response: Response, next: NextFunction): void => {
    try {
        const token = extractBearer(request);
        const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
        const userId = Number(decoded.sub);
        if (!Number.isInteger(userId) || userId <= 0 || !decoded.email || !decoded.nivel) {
            throw new UnauthorizedError('Token inválido.');
        }
        request.user = { id: userId, email: decoded.email, nivel: decoded.nivel };
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
            return;
        }
        next(new UnauthorizedError('Token inválido ou expirado.'));
    }
};

export const requireAdmin = (request: Request, _response: Response, next: NextFunction): void => {
    if (request.user?.nivel !== 'ADMIN') {
        next(new ForbiddenError('Apenas administradores podem acessar este recurso.'));
        return;
    }
    next();
};
