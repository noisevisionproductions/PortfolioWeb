import {describe, test, expect, vi, beforeEach} from 'vitest';
import {createErrorHandler} from "@/auth/services/errorHandler";
import {redirectTo} from "@/auth/services/navigationService";
import {ApiError, ValidationError, AuthError} from "@/auth/types/errors";
import i18nTranslation from "@/utils/translations/i18nTranslation";

vi.mock('@/auth/services/navigationService', () => ({
    redirectTo: vi.fn()
}));

vi.mock('@/utils/translations/i18nTranslation', () => ({
    default: {
        t: vi.fn((key: string) => key)
    }
}));

const simulateAxiosError = (status: number, data: any) => ({
    isAxiosError: true,
    response: {status, data},
});

const testErrorHandler = <T extends Error>(
    error: any,
    expectedInstance: new (...args: any[]) => T,
    expectedProps: Record<string, any>,
    redirectPath?: string
) => {
    const result = catchError<T>(() => {
        createErrorHandler(error);
    });

    expect(result).toBeInstanceOf(expectedInstance);

    Object.entries(expectedProps).forEach(([key, value]) => {
        expect((result as any)[key]).toBe(value);
    });

    if (redirectPath) {
        expect(redirectTo).toHaveBeenCalledWith(redirectPath);
    }
};

const catchError = <T extends Error>(fn: () => void): T => {
    expect(() => {
        fn();
    }).toThrow();

    try {
        fn();
    } catch (e) {
        if (e instanceof Error) {
            return e as T;
        }
        throw new Error('Caught value is not an Error instance');
    }

    throw new Error('Unreachable code');
};

describe('createErrorHandler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should handle 400 error with generic type', () => {
        const error = simulateAxiosError(400, {type: 'error', key: 'generic'});
        testErrorHandler<ApiError>(error, ApiError, {status: 403, code: 'FORBIDDEN'}, '/unauthorized');
    });

    test('should handle 400 error with validation errors', () => {
        const validationErrors = {field1: 'Error 1', field2: 'Error 2'};
        const error = simulateAxiosError(400, {errors: validationErrors});
        testErrorHandler<ValidationError>(error, ValidationError, {errors: validationErrors});
    });

    test('should handle 401 error and redirect to login', () => {
        const error = simulateAxiosError(401, {});
        testErrorHandler<AuthError>(error, AuthError, {type: 'unauthorized', key: 'session_expired'}, '/login');
    });

    test('should handle 403 error and redirect to unauthorized', () => {
        const error = simulateAxiosError(403, {});
        testErrorHandler<ApiError>(error, ApiError, {status: 403, code: 'FORBIDDEN'}, '/unauthorized');
    });

    test('should handle unknown HTTP error', () => {
        const error = simulateAxiosError(504, {message: 'Gateway Timeout', code: 'TIMEOUT_ERROR'});
        testErrorHandler<ApiError>(error, ApiError, {status: 504, code: 'TIMEOUT_ERROR'});
    });

    test('should handle non-Axios error', () => {
        const error = new Error('Zwykły błąd JavaScript');
        testErrorHandler<ApiError>(error, ApiError, {status: 500, code: 'UNKNOWN_ERROR'});
    });

    test('should use default message for unexpected error', () => {
        const error = simulateAxiosError(500, {});
        const result = catchError<ApiError>(() => {
            createErrorHandler(error);
        });

        expect(result).toBeInstanceOf(ApiError);
        expect(result.status).toBe(500);
        expect(i18nTranslation.t).toHaveBeenCalledWith('errors.unexpected');
    });
});
