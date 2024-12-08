import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {LoginPage} from "@/auth/components/login/LoginPage";
import {vi} from "vitest";
import '@testing-library/jest-dom';

const loginMock = vi.fn();

vi.mock('@/auth/hooks/useBaseAuthContext', () => ({
    useBaseAuthContext: vi.fn(() => ({
        login: loginMock,
        register: vi.fn(),
        user: {email: 'test@example.com', role: 'USER', authorities: ['ROLE_USER']},
        hasAuthority: vi.fn((authority) => authority === 'ROLE_USER'),
        clearError: vi.fn(),
    })),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'login.title': 'Login',
                'login.email': 'Email',
                'login.password': 'Password',
                'login.submit': 'Submit',
                'login.errors.emailRequired': 'Email is required',
                'login.errors.passwordRequired': 'Password is required',
                'login.success.title': 'Login Successful',
                'login.success.description': 'You have logged in successfully.',
            };
            return translations[key] || key;
        }
    }),
}));


describe('LoginPage', () => {
    test('should render login form', () => {
        render(
            <MemoryRouter>
                <LoginPage/>
            </MemoryRouter>
        );

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('should call login function on form submit', async () => {
        loginMock.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <LoginPage/>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Email'), {
            target: {value: 'test@example.com'},
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: {value: 'password123'},
        });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    test('should show validation errors if fields are empty', async () => {
        render(
            <MemoryRouter>
                <LoginPage/>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });
});
