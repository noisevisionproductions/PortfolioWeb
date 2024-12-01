import {vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {Authority} from "@/auth/types/roles";
import {ProjectHeader} from "@/projects/components/projectDetails/ProjectHeader";
import {AuthContextType, useBaseAuthContext} from "@/auth/hooks/useBaseAuthContext";

const createMockAuthContext = (hasAuthorityImplementation: (authority: string) => boolean): AuthContextType => ({
    user: null,
    loading: false,
    error: null,
    hasAuthority: hasAuthorityImplementation,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    fetchUser: vi.fn(),
    clearError: vi.fn(),
});

vi.mock("@/auth/hooks/useBaseAuthContext", () => ({
    useBaseAuthContext: vi.fn(() => createMockAuthContext(() => false))
}));

vi.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">Back Icon</div>,
    Pencil: () => <div data-testid="pencil-icon">Edit Icon</div>,
    Trash2: () => <div data-testid="trash-icon">Delete Icon</div>
}));

const mockTranslation = (key: string) => key;

describe('ProjectHeader', () => {
    const defaultProps = {
        onBack: vi.fn(),
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        t: mockTranslation
    };

    test('should always render back button', () => {
        render(
            <ProjectHeader {...defaultProps}/>
        );

        const backButton = screen.getByText('projectDetails.back');
        expect(backButton).toBeInTheDocument();
        expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    test('should call onBack when back button is clicked', () => {
        render(
            <ProjectHeader {...defaultProps}/>
        );

        const backButton = screen.getByText('projectDetails.back');
        fireEvent.click(backButton);

        expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    test('should not render management buttons when user has no permission', () => {
        render(
            <ProjectHeader {...defaultProps}/>
        );

        expect(screen.queryByText('projectDetails.edit')).not.toBeInTheDocument();
        expect(screen.queryByText('projectDetails.delete')).not.toBeInTheDocument();
    });

    test('should render edit button when user has EDIT_PROJECTS permission', () => {
        const mockAuthContext = createMockAuthContext(
            (authority: string) => authority === Authority.EDIT_PROJECTS
        );
        vi.mocked(useBaseAuthContext).mockImplementation(() => mockAuthContext);

        render(
            <ProjectHeader {...defaultProps}/>
        );

        expect(screen.getByText('projectDetails.edit')).toBeInTheDocument();
        expect(screen.queryByText('projectDetails.delete')).not.toBeInTheDocument();
    });

    test('should render delete button when user has DELETE_PROJECTS permission', () => {
        const mockAuthContext = createMockAuthContext(
            (authority: string) => authority === Authority.DELETE_PROJECTS
        );
        vi.mocked(useBaseAuthContext).mockImplementation(() => mockAuthContext);

        render(<ProjectHeader {...defaultProps} />);

        expect(screen.queryByText('projectDetails.edit')).not.toBeInTheDocument();
        expect(screen.getByText('projectDetails.delete')).toBeInTheDocument();
    });

    test('should render both management buttons when user has both permissions', () => {
        const mockAuthContext = createMockAuthContext(() => true);
        vi.mocked(useBaseAuthContext).mockImplementation(() => mockAuthContext);

        render(
            <ProjectHeader {...defaultProps}/>
        );

        expect(screen.getByText('projectDetails.edit')).toBeInTheDocument();
        expect(screen.queryByText('projectDetails.delete')).toBeInTheDocument();
    });

    test('should call onEdit when edit button is clicked', () => {
        const mockAuthContext = createMockAuthContext(() => true);
        vi.mocked(useBaseAuthContext).mockImplementation(() => mockAuthContext);

        render(<ProjectHeader {...defaultProps} />);

        const editButton = screen.getByText('projectDetails.edit');
        fireEvent.click(editButton);

        expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
    });

    test('should call onDelete when delete button is clicked', () => {
        const mockAuthContext = createMockAuthContext(() => true);
        vi.mocked(useBaseAuthContext).mockImplementation(() => mockAuthContext);

        render(<ProjectHeader {...defaultProps} />);

        const deleteButton = screen.getByText('projectDetails.delete');
        fireEvent.click(deleteButton);

        expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    });
})