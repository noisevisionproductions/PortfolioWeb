import {vi, describe, test, expect, beforeEach} from 'vitest';
import {baseAuthService} from "@/auth/services/baseAuthService";
import {AuthError, ValidationError} from '@/auth/types/errors';
import api from "../../../utils/axios";
import axios from "axios";
import {localStorageMock} from "../../setup";

vi.mock('../../../utils/axios');
const mockedApi = api as jest.Mocked<typeof api>;

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
            mockedApi.post.mockResolvedValueOnce({data: mockAuthResponse});

            const result = await baseAuthService.register(mockRegisterData);

            expect(result).toEqual(mockAuthResponse);
            expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockAuthResponse.token);
            expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/register', mockRegisterData);
        });

        test('should handle validation error', async () => {
            const validationError = {
                isAxiosError: true,
                response: {
                    data: {
                        email: 'Email jest nieprawidłowy',
                        password: 'Hasło jest za krótkie'
                    }
                }
            };

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
            mockedApi.post.mockRejectedValueOnce(validationError);

            const promise = baseAuthService.register(mockRegisterData);

            await expect(promise).rejects.toBeInstanceOf(ValidationError);
            await expect(promise).rejects.toMatchObject({
                errors: {
                    email: 'Email jest nieprawidłowy',
                    password: 'Hasło jest za krótkie'
                }
            });
        });

        test('should handle auth error', async () => {
            const authError = {
                response: {
                    data: {
                        type: 'error',
                        key: 'emailTaken'
                    }
                }
            };

            mockedApi.post.mockRejectedValueOnce(authError);

            await expect(baseAuthService.register(mockRegisterData))
                .rejects
                .toThrow(AuthError);
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
            (localStorageMock.getItem as any).mockReturnValue(null);
        });

        test('should successfully login user', async () => {
            mockedApi.post.mockResolvedValueOnce({data: mockAuthResponse});

            const result = await baseAuthService.login(mockLoginData);

            expect(result).toEqual(mockAuthResponse);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockAuthResponse.token);
            expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/login', mockLoginData);
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

            mockedApi.post.mockRejectedValueOnce(authError);

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

        test('should successfully fetch user data', async () => {
            localStorage.setItem('token', 'test-token');
            mockedApi.get.mockResolvedValueOnce({data: mockUserData});

            const result = await baseAuthService.fetchUserData();

            expect(result).toEqual(mockUserData);
            expect(mockedApi.get).toHaveBeenCalledWith('/api/auth/me');
        });

        test('should throw error when no token exists', async () => {
            await expect(baseAuthService.fetchUserData())
                .rejects
                .toThrow(AuthError);
        });

        test('should handle fetch error', async () => {
            localStorage.setItem('token', 'test-token');
            mockedApi.get.mockRejectedValueOnce({
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