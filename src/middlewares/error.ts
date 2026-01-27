// src/middlewares/error.ts
// Centralized error handling middleware
// Stanford Architecture: No try/catch scattered everywhere

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Custom application error class
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Not Found error (404)
 */
export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
    public readonly errors: Record<string, string[]>;

    constructor(errors: Record<string, string[]>) {
        super('Validation failed', 400, 'VALIDATION_ERROR');
        this.errors = errors;
    }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 403, 'FORBIDDEN');
    }
}

/**
 * Convert ZodError to ValidationError
 */
function zodErrorToValidationError(error: ZodError): ValidationError {
    const errors: Record<string, string[]> = {};

    error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
            errors[path] = [];
        }
        errors[path].push(err.message);
    });

    return new ValidationError(errors);
}

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error(`[Error] ${req.method} ${req.path}:`, err);

    // Zod validation errors
    if (err instanceof ZodError) {
        const validationError = zodErrorToValidationError(err);
        res.status(validationError.statusCode).json({
            success: false,
            error: {
                code: validationError.code,
                message: validationError.message,
                details: validationError.errors,
            },
        });
        return;
    }

    // App-specific errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err instanceof ValidationError && { details: err.errors }),
            },
        });
        return;
    }

    // Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({
                success: false,
                error: {
                    code: 'DUPLICATE_ENTRY',
                    message: 'A record with this value already exists',
                },
            });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Record not found',
                },
            });
            return;
        }
    }

    // Unknown errors
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
        },
    });
}

/**
 * Async handler wrapper - eliminates try/catch blocks in controllers
 */
export function asyncHandler<T>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
    next(new NotFoundError(`Route ${req.method} ${req.path}`));
}
