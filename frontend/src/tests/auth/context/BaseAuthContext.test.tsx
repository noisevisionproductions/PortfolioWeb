import {describe, test, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {AuthProvider, BaseAuthContext} from "@/auth/context/BaseAuthContext";
import {baseAuthService} from "@/auth/services/baseAuthService";
import {AuthError} from "@/auth/types/errors";
import {useContext} from 'react';

const originalError = console.error;

vi.mock('@/auth/services/baseAuthService', () => ({
    baseAuthService: {
        isAuthenticated: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUserData: vi.fn(),
    },
}));

const TestComponent = () => {
    const context = useContext(BaseAuthContext);
    if (!context) throw new Error('Context not provided');
    return (
        <div>
            <div data-testid="loading">{context.loading.toString()}</div>
            <div data-testid="user">{JSON.stringify(context.user)}</div>
            <div data-testid="error">{context.error?.type}</div>
            <button onClick={async () => {
                try {
                    await context.login({email: 'test@example.com', password: 'password'});
                } catch (e) {
                    // ignoruj błąd w teście
                }
            }}>Login
            </button>
            <button onClick={async () => {
                try {
                    context.logout();
                } catch (e) {
                    // ignoruj błąd w teście
                }
            }}>Logout
            </button>
        </div>
    );
};

describe('AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    beforeAll(() => {
        console.error = (...args: any[]) => {
            const errorMessage = args[0]?.toString() || '';
            if (
                errorMessage.includes('Auth error:') ||
                errorMessage.includes('AuthContext - Error fetching user:') ||
                errorMessage.includes('Authentication Error') ||
                (args[0] instanceof AuthError) ||
                errorMessage.includes('Failed to fetch') ||
                errorMessage.includes('Falling through to default error case')
            ) {
                return;
            }
            originalError(...args);
        };
    });

    test('powinien wyrenderować się z początkowym stanem', () => {
        vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(false);

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('error')).toHaveTextContent('');
    });

    test('powinien załadować użytkownika jeśli jest uwierzytelniony', async () => {
        const mockUser = {
            email: 'test@example.com',
            role: 'USER',
            authorities: ['ROLE_USER']
        };

        vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(true);
        vi.mocked(baseAuthService.fetchUserData).mockResolvedValue(mockUser);

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });

        expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    test('powinien obsłużyć błąd logowania', async () => {
        const loginError = new AuthError('error', 'invalid_credentials');
        vi.mocked(baseAuthService.login).mockRejectedValue(loginError);

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        fireEvent.click(screen.getByText('Login'));


        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('error');
        });

        expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    test('powinien pomyślnie wylogować użytkownika', async () => {
        const mockUser = {
            email: 'test@example.com',
            role: 'USER',
            authorities: ['ROLE_USER']
        };

        vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(true);
        vi.mocked(baseAuthService.fetchUserData).mockResolvedValue(mockUser);

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
        });

        fireEvent.click(screen.getByText('Logout'));

        expect(baseAuthService.logout).toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    test('powinien sprawdzić uprawnienia użytkownika', async () => {
        const mockUser = {
            email: 'test@example.com',
            role: 'USER',
            authorities: ['ROLE_USER', 'ROLE_ADMIN']
        };

        const TestAuthority = () => {
            const context = useContext(BaseAuthContext);
            if (!context) throw new Error('Context not provided');
            return (
                <div data-testid="has-authority">
                    {context.hasAuthority('ROLE_ADMIN').toString()}
                </div>
            );
        };

        vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(true);
        vi.mocked(baseAuthService.fetchUserData).mockResolvedValue(mockUser);

        render(
            <AuthProvider>
                <TestAuthority/>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('has-authority')).toHaveTextContent('true');
        });
    });

    test('powinien obsłużyć błąd podczas ładowania użytkownika', async () => {
        const error = new AuthError('error', 'fetch_failed');
        vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(true);
        vi.mocked(baseAuthService.fetchUserData).mockRejectedValue(error);

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('error');
        });

        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    test('powinien wyczyścić błąd po wywołaniu clearError', async () => {
        const TestError = () => {
            const context = useContext(BaseAuthContext);
            if (!context) throw new Error('Context not provided');
            return (
                <>
                    <div data-testid="error">{context.error?.type}</div>
                    <button onClick={context.clearError}>Clear Error</button>
                </>
            );
        };

        const error = new AuthError('error', 'test_error');
        vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(true);
        vi.mocked(baseAuthService.fetchUserData).mockRejectedValue(error);

        render(
            <AuthProvider>
                <TestError/>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('error');
        });

        fireEvent.click(screen.getByText('Clear Error'));
        expect(screen.getByTestId('error')).toHaveTextContent('');
    });
});