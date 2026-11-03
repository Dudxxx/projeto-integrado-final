import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message
        });
        return;
    }

    console.error(error);
    response.status(500).json({
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Ocorreu um erro interno. Tente novamente.'
    });
};
