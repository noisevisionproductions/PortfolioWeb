import {vi, describe, test, expect, beforeEach} from 'vitest';
import {baseAuthService} from "@/auth/services/baseAuthService";
import {AuthError, ValidationError} from '@/auth/types/errors';
import {localStorageMock} from "@/tests/setup";
import {fail} from "node:assert";
import api from "@/utils/axios";

const mockPost = vi.fn();

vi.mock('@/utils/axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn()
    }
}));

describe('baseAuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.localStorage.clear();
    });

    describe('register', () => {
        const mockRegisterData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            companyName: 'Test Company',
            programmingLanguages: ['JavaScript', 'TypeScript']
        };

        const mockAuthResponse = {
            token: 'test-token',
            email: 'test@example.com',
            role: 'USER',
            authorities: ['ROLE_USER']
        };

        test('should successfully register user', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({
                data: mockAuthResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            });

            const result = await baseAuthService.register(mockRegisterData);

            expect(result).toEqual(mockAuthResponse);
            expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockAuthResponse.token);
            expect(api.post).toHaveBeenCalledWith('/api/auth/register', mockRegisterData);
        });


        test('should handle validation error correctly', async () => {
            const validationErrors = {
                email: 'Email jest nieprawidłowy',
                password: 'Hasło jest za krótkie'
            };

            vi.mocked(api.post).mockRejectedValueOnce({
                isAxiosError: true,
                response: {
                    status: 400,
                    data: {
                        errors: validationErrors
                    }
                }
            });

            try {
                await baseAuthService.register(mockRegisterData);
                fail('Should have thrown ValidationError');
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                expect((error as ValidationError).errors).toEqual(validationErrors);
            }
        });

        test('should handle authentication error', async () => {
            vi.mocked(api.post).mockRejectedValueOnce({
                isAxiosError: true,
                response: {
                    status: 400,
                    data: {
                        type: 'error',
                        key: 'emailTaken'
                    }
                }
            });

            try {
                await baseAuthService.register(mockRegisterData);
                fail('Should have thrown AuthError');
            } catch (error) {
                expect(error).toBeInstanceOf(AuthError);
                expect((error as AuthError).type).toBe('error');
                expect((error as AuthError).key).toBe('emailTaken');
            }
        });
    });

    describe('login', () => {
        const mockLoginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        const mockAuthResponse = {
            token: 'test-token',
            email: 'test@example.com',
            role: 'USER',
            authorities: ['ROLE_USER']
        };

        beforeEach(() => {
            vi.clearAllMocks();
            window.localStorage.clear();
        });

        test('should successfully login user', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({
                data: mockAuthResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            });

            const result = await baseAuthService.login(mockLoginData);

            expect(result).toEqual(mockAuthResponse);
            expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockAuthResponse.token);
            expect(api.post).toHaveBeenCalledWith('/api/auth/login', mockLoginData);
        });

        test('should handle invalid credentials', async () => {
            const authError = {
                response: {
                    data: {
                        type: 'error',
                        key: 'invalidCredentials'
                    }
                }
            };

            mockPost.mockRejectedValueOnce(authError);

            await expect(baseAuthService.login(mockLoginData))
                .rejects
                .toThrow(AuthError);
        });
    });

    describe('logout', () => {
        test('should remove token from localStorage', () => {
            localStorageMock.setItem('token', 'test-token');
            baseAuthService.logout();
            expect(localStorageMock.getItem('token')).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        test('should return true when token exists', () => {
            localStorageMock.getItem.mockReturnValue('test-token');
            expect(baseAuthService.isAuthenticated()).toBe(true);

            expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
        });
    });

    describe('getToken', () => {
        test('should return token when it exists', () => {
            localStorageMock.getItem.mockReturnValue('test-token');
            expect(baseAuthService.getToken()).toBe('test-token');

            expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
        });
    });

    describe('fetchUserData', () => {
        const mockUserData = {
            email: 'test@example.com',
            name: 'Test User',
            role: 'USER'
        };

        beforeEach(() => {
            vi.clearAllMocks();
            window.localStorage.clear();
        });

        test('should successfully fetch user data', async () => {
            window.localStorage.setItem('token', 'test-token');

            vi.mocked(api.get).mockResolvedValueOnce({
                data: mockUserData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            });

            const result = await baseAuthService.fetchUserData();

            expect(result).toEqual(mockUserData);
            expect(api.get).toHaveBeenCalledWith('/api/auth/me');
        });

        test('should throw error when no token exists', async () => {
            await expect(baseAuthService.fetchUserData())
                .rejects
                .toThrow(AuthError);
        });

        test('should handle fetch error', async () => {
            localStorage.setItem('token', 'test-token');
            mockPost.mockRejectedValueOnce({
                response: {
                    data: {
                        type: 'error',
                        key: 'unauthorized'
                    }
                }
            });

            await expect(baseAuthService.fetchUserData())
                .rejects
                .toThrow(AuthError);
        });
    });
});