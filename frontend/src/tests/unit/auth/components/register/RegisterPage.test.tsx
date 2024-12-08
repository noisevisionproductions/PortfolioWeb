import {vi} from "vitest";
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import {RegisterPage} from "@/auth/components/register/RegisterPage";

const mockNavigate = vi.fn();
const mockRegister = vi.fn();

vi.mock("@/auth/hooks/useBaseAuthContext", () => ({
    useBaseAuthContext: () => ({
        user: null,
        loading: false,
        login: vi.fn(),
        register: mockRegister,
        logout: vi.fn(),
        hasAuthority: vi.fn(),
        fetchUser: vi.fn(),
        clearError: vi.fn(),
        error: null
    })
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

const fillRegistrationForm = (getByLabelText: any, getByText: any) => {
    fireEvent.change(getByLabelText('register.email'), {
        target: {value: 'test@example.com'}
    });
    fireEvent.change(getByLabelText('register.password'), {
        target: {value: 'password123'}
    });
    fireEvent.click(getByText('register.submit'));
};

describe('RegisterPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render all form inputs', () => {
        const {getByLabelText} = render(<RegisterPage/>);

        expect(getByLabelText('register.name')).toBeDefined();
        expect(getByLabelText('register.companyName')).toBeDefined();
        expect(getByLabelText('register.email')).toBeDefined();
        expect(getByLabelText('register.password')).toBeDefined();
    });

    test('should update from values on input change', () => {
        const {getByLabelText} = render(<RegisterPage/>);

        const nameInput = getByLabelText('register.name') as HTMLInputElement;
        const emailInput = getByLabelText('register.email') as HTMLInputElement;

        fireEvent.change(nameInput, {target: {value: 'John Doe'}});
        fireEvent.change(emailInput, {target: {value: 'john@example.com'}});

        expect(nameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john@example.com');
    });

    test('should call register function on form submit', async () => {
        const {getByLabelText, getByText} = render(<RegisterPage/>);

        await act(async () => {
            fillRegistrationForm(getByLabelText, getByText);
        });

        expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
            email: 'test@example.com',
            password: 'password123'
        }));
    });

    test('should call register function on form submit', async () => {
        const {getByLabelText, getByText} = render(<RegisterPage/>);

        await act(async () => {
            fillRegistrationForm(getByLabelText, getByText);
        });

        expect(mockRegister).toHaveBeenCalledWith(
            expect.objectContaining({
                email: 'test@example.com',
                password: 'password123',
            })
        );
    });

    test('should navigate to home page after showing success alert on successful registration', async () => {
        mockRegister.mockImplementationOnce(() => Promise.resolve({}));

        const {getByLabelText, getByText, queryByText} = render(<RegisterPage/>);

        await act(async () => {
            fillRegistrationForm(getByLabelText, getByText);
        });

        await waitFor(() => {
            expect(queryByText('register.success.title')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(getByText('OK'));
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });


    test('should handle programming language selection', () => {
        const {getByText} = render(<RegisterPage/>);

        fireEvent.click(getByText('Java'));

        expect(getByText('Java').className).toContain('bg-primary');
    });
});