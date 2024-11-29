import {describe, test, expect, vi, beforeEach} from 'vitest';
import {createErrorHandler} from "@/auth/services/errorHandler";
import {redirectTo} from "@/auth/services/navigationService";
import {ApiError, ValidationError, AuthError} from "@/auth/types/errors";
import i18nTranslation from "../../../utils/translations/i18nTranslation";

vi.mock('../../../auth/services/navigationService', () => ({
    redirectTo: vi.fn()
}));

vi.mock('../../../utils/translations/i18nTranslation', () => ({
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

    test('powinien obsłużyć błąd 400 z typem generic', () => {
        const error = simulateAxiosError(400, {type: 'error', key: 'generic'});
        testErrorHandler<ApiError>(error, ApiError, {status: 403, code: 'FORBIDDEN'}, '/unauthorized');
    });

    test('powinien obsłużyć błąd 400 z błędami walidacji', () => {
        const validationErrors = {field1: 'Error 1', field2: 'Error 2'};
        const error = simulateAxiosError(400, {errors: validationErrors});
        testErrorHandler<ValidationError>(error, ValidationError, {errors: validationErrors});
    });

    test('powinien obsłużyć błąd 401 i przekierować do strony logowania', () => {
        const error = simulateAxiosError(401, {});
        testErrorHandler<AuthError>(error, AuthError, {type: 'unauthorized', key: 'session_expired'}, '/login');
    });

    test('powinien obsłużyć błąd 403 i przekierować do strony unauthorized', () => {
        const error = simulateAxiosError(403, {});
        testErrorHandler<ApiError>(error, ApiError, {status: 403, code: 'FORBIDDEN'}, '/unauthorized');
    });

    test('powinien obsłużyć nieznany błąd HTTP', () => {
        const error = simulateAxiosError(504, {message: 'Gateway Timeout', code: 'TIMEOUT_ERROR'});
        testErrorHandler<ApiError>(error, ApiError, {status: 504, code: 'TIMEOUT_ERROR'});
    });

    test('powinien obsłużyć błąd, który nie jest błędem Axiosa', () => {
        const error = new Error('Zwykły błąd JavaScript');
        testErrorHandler<ApiError>(error, ApiError, {status: 500, code: 'UNKNOWN_ERROR'});
    });

    test('powinien użyć domyślnej wiadomości dla nieoczekiwanego błędu', () => {
        const error = simulateAxiosError(500, {});
        const result = catchError<ApiError>(() => {
            createErrorHandler(error);
        });

        expect(result).toBeInstanceOf(ApiError);
        expect(result.status).toBe(500);
        expect(i18nTranslation.t).toHaveBeenCalledWith('errors.unexpected');
    });
});
