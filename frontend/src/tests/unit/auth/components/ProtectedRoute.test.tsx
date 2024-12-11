import {vi} from "vitest";
import {useBaseAuthContext} from "@/auth/hooks/useBaseAuthContext";
import {MemoryRouter} from "react-router-dom";
import {ProtectedRoute} from "@/auth/components/ProtectedRoute";
import {render, screen} from '@testing-library/react';
import {Authority} from "@/auth/types/roles";

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(() => ({pathname: '/protected'})),
        Navigate: vi.fn(({to}) => <div data-testid="navigate">Redirecting to: {to}</div>)
    };
});

vi.mock('@/auth/hooks/useBaseAuthContext');
vi.mock('@/components/shared/LoadingSpinner', () => ({
    LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>
}));

describe('ProtectedRoute', () => {
    const mockUseBaseAuthContext = useBaseAuthContext as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks;
    });

    test('should display LoadingSpinner while loading', () => {
        mockUseBaseAuthContext.mockReturnValue({
            loading: true,
            user: null,
            hasAuthority: vi.fn()
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>
                        Protected content
                    </div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('should redirect to /login when user is not logged in', () => {
        mockUseBaseAuthContext.mockReturnValue({
            loading: false,
            user: null,
            hasAuthority: vi.fn()
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>
                        Protected content
                    </div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to: /login');
    });

    test('should redirect to /unauthorized when user does not have required authority', () => {
        const mockHasAuthority = vi.fn(() => false);
        mockUseBaseAuthContext.mockReturnValue({
            loading: false,
            user: {email: 'test@example.com'},
            hasAuthority: mockHasAuthority
        });

        render(
            <MemoryRouter>
                <ProtectedRoute requiredAuthorities={['ROLE_ADMIN' as Authority]}>
                    <div>
                        Protected content
                    </div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(mockHasAuthority).toHaveBeenCalledWith('ROLE_ADMIN' as Authority);
        expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to: /unauthorized');
    });

    test('should display content when user has required authority', () => {
        mockUseBaseAuthContext.mockReturnValue({
            loading: false,
            user: {email: 'test@example.com'},
            hasAuthority: vi.fn(() => true)
        });

        render(
            <MemoryRouter>
                <ProtectedRoute requiredAuthorities={['ROLE_USER' as Authority]}>
                    <div>
                        Protected content
                    </div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected content')).toBeInTheDocument();
    });

    test('should display content when user does not have required authority', () => {
        mockUseBaseAuthContext.mockReturnValue({
            loading: false,
            user: {email: 'test@example.com'},
            hasAuthority: vi.fn()
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>
                        Protected content
                    </div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected content')).toBeInTheDocument();
    });
});