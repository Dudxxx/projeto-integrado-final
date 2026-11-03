export class AppError extends Error {
    public constructor(
        message: string,
        public readonly statusCode: number,
        public readonly code: string = 'APP_ERROR'
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    public constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class UnauthorizedError extends AppError {
    public constructor(message = 'Não autenticado.') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    public constructor(message = 'Acesso negado.') {
        super(message, 403, 'FORBIDDEN');
    }
}

export class NotFoundError extends AppError {
    public constructor(message = 'Registro não encontrado.') {
        super(message, 404, 'NOT_FOUND');
    }
}

export class ConflictError extends AppError {
    public constructor(message: string) {
        super(message, 409, 'CONFLICT');
    }
}
