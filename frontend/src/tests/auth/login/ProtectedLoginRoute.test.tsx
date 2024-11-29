import {render, screen, act, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {vi, describe, test, expect, beforeEach} from 'vitest';
import ProtectedLoginRoute from "../../../auth/components/login/ProtectedLoginRoute";
import {useBaseAuthContext} from "../../../auth/hooks/useBaseAuthContext";

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as any,
        useNavigate: () => navigateMock
    };
});

vi.mock('../../../auth/hooks/useBaseAuthContext', () => ({
    useBaseAuthContext: vi.fn()
}));

vi.mock('../../../components/shared/RedirectingPage', () => ({
    RedirectingPage: () => <div data-testid="redirecting-page">Redirecting...</div>
}));

vi.mock('../../../auth/components/login/LoginPage', () => ({
    LoginPage: ({onLoginAttempt}: { onLoginAttempt: () => void }) => (
        <div data-testid="login-page" onClick={onLoginAttempt}>
            Login Page
        </div>
    )
}));

const navigateMock = vi.fn();

const mockAuthContext = {
    user: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    hasAuthority: vi.fn()
};

describe('ProtectedLoginRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (useBaseAuthContext as any).mockReturnValue(mockAuthContext);
    });

    test('displays RedirectingPage during initial loading', () => {
        (useBaseAuthContext as any).mockReturnValue({
            user: null,
            loading: true,
            hasAuthority: vi.fn()
        });

        render(
            <MemoryRouter>
                <ProtectedLoginRoute/>
            </MemoryRouter>
        );

        expect(screen.getByTestId('redirecting-page')).toBeTruthy();
    });

    test('displays LoginPage when user is not authenticated', () => {
        (useBaseAuthContext as any).mockReturnValue({
            user: null,
            loading: false,
            hasAuthority: vi.fn()
        });

        render(
            <MemoryRouter>
                <ProtectedLoginRoute/>
            </MemoryRouter>
        );

        expect(screen.getByTestId('login-page')).toBeTruthy();
    });

    test('redirects to home page when user is authenticated', async () => {
        (useBaseAuthContext as any).mockReturnValue({
            user: {id: 1, name: 'Test User'},
            loading: false,
            hasAuthority: vi.fn()
        });

        render(
            <MemoryRouter>
                <ProtectedLoginRoute/>
            </MemoryRouter>
        );

        expect(screen.getByTestId('redirecting-page')).toBeTruthy();

        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        expect(navigateMock).toHaveBeenCalledWith('/');
    });

    test('does not redirect during login attempt', () => {
        (useBaseAuthContext as any).mockReturnValue({
            user: null,
            loading: false,
            hasAuthority: vi.fn(),
            login: vi.fn(),
            logout: vi.fn(),
            register: vi.fn()
        });

        render(
            <MemoryRouter>
                <ProtectedLoginRoute/>
            </MemoryRouter>
        );

        const loginPage = screen.getByTestId('login-page');
        expect(loginPage).toBeTruthy();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(navigateMock).not.toHaveBeenCalled();
    });

    test('waits for loading to complete before making redirect decision', () => {
        (useBaseAuthContext as any).mockReturnValue({
            user: null,
            loading: true,
            hasAuthority: vi.fn(),
            login: vi.fn(),
            logout: vi.fn(),
            register: vi.fn()
        });

        const {rerender} = render(
            <MemoryRouter>
                <ProtectedLoginRoute/>
            </MemoryRouter>
        );

        expect(screen.getByTestId('redirecting-page')).toBeTruthy();

        (useBaseAuthContext as any).mockReturnValue({
            user: null,
            loading: false,
            hasAuthority: vi.fn()
        });

        (useBaseAuthContext as any).mockReturnValue({
            user: null,
            loading: false,
            hasAuthority: vi.fn(),
            login: vi.fn(),
            logout: vi.fn(),
            register: vi.fn()
        });

        rerender(
            <MemoryRouter>
                <ProtectedLoginRoute/>
            </MemoryRouter>
        );

        expect(screen.getByTestId('login-page')).toBeTruthy();
    });

    test('cleans up timeout on component unmount', () => {
        (useBaseAuthContext as any).mockReturnValue({
            user: {id: 1, name: 'Test User'},
            loading: false,
            hasAuthority: vi.fn()
        });

        const {unmount} = render(
            <MemoryRouter>
                <ProtectedLoginRoute/>
            </MemoryRouter>
        );

        unmount();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(navigateMock).not.toHaveBeenCalled();
    });
});