import {vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {Project, ProjectStatus} from "@/projects/types/project";
import {ProjectDetailsPage} from "@/projects/components/projectDetails/ProjectDetailsPage";
import {ApiError} from "@/auth/types/errors";
import React from "react";

const mockAuthContext = {
    user: null,
    loading: false,
    error: null,
    hasAuthority: vi.fn().mockImplementation(() => true),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    fetchUser: vi.fn(),
    clearError: vi.fn()
};

vi.mock('@/auth/hooks/useBaseAuthContext', () => ({
    useBaseAuthContext: () => mockAuthContext
}));

const mockGetProjectBySlug = vi.fn();
const mockDeleteProject = vi.fn();
const mockDeleteProjectImage = vi.fn();

const mockBaseProjectHook = {
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,
    fetchProjects: vi.fn(),
    getProject: vi.fn(),
    getProjectBySlug: mockGetProjectBySlug,
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: mockDeleteProject
};

const mockProjectImageHook = {
    loading: false,
    error: null,
    uploadProjectImage: vi.fn(),
    deleteProjectImage: mockDeleteProjectImage
};

vi.mock('@/projects/hooks/useBaseProject', () => ({
    useBaseProject: () => mockBaseProjectHook
}));

vi.mock('@/projects/hooks/useProjectImage', () => ({
    useProjectImage: () => mockProjectImageHook
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({slug: 'test-project'})
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

vi.mock('@/utils/imageUtils', () => ({
    getImageUrl: vi.fn((url: string) => url)
}));

const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    slug: 'test-project',
    description: 'Test Description',
    status: ProjectStatus.IN_PROGRESS,
    technologies: ['React', 'TypeScript'],
    features: ['Feature 1'],
    contributors: [],
    projectImages: [
        {id: 1, imageUrl: 'test1.jpg', caption: 'Test Image 1'}
    ]
};

const renderWithProviders = (component: React.ReactNode) => {
    const { MemoryRouter } = require('react-router-dom');
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
};

describe('ProjectDetailsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();

        mockAuthContext.hasAuthority.mockImplementation(() => true);

        Object.assign(mockBaseProjectHook, {
            projects: [],
            selectedProject: mockProject,
            loading: false,
            error: null,
            fetchProjects: vi.fn(),
            getProject: vi.fn(),
            getProjectBySlug: mockGetProjectBySlug,
            createProject: vi.fn(),
            updateProject: vi.fn(),
            deleteProject: mockDeleteProject
        });

        Object.assign(mockProjectImageHook, {
            loading: false,
            error: null,
            uploadProjectImage: vi.fn(),
            deleteProjectImage: mockDeleteProjectImage
        });
    });

    describe('Loading and Error States', () => {
        test('should render loading spinner when loading', () => {
            Object.assign(mockBaseProjectHook, {
                loading: true,
                selectedProject: null
            });

            render(<ProjectDetailsPage/>);
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });

        test('should render error message when error occurs', () => {
            Object.assign(mockBaseProjectHook, {
                error: 'Test error',
                selectedProject: null
            });

            render(<ProjectDetailsPage/>);
            expect(screen.getByText('Test error')).toBeInTheDocument();
        });
    });

    describe('Project Data Display', () => {
        test('should render project details when data is loaded', () => {
            render(<ProjectDetailsPage/>);
            expect(screen.getByText(mockProject.name)).toBeInTheDocument();
        });

        test('should fetch project on mount', async () => {
            render(<ProjectDetailsPage/>);
            await waitFor(() => {
                expect(mockGetProjectBySlug).toHaveBeenCalledWith('test-project');
            });
        });
    });

    describe('Navigation', () => {
        test('should navigate to home when background is clicked', () => {
            renderWithProviders(<ProjectDetailsPage/>);
            const background = screen.getByTestId('project-background');

            fireEvent.click(background, {
                target: background,
                currentTarget: background,
                bubbles: true
            });

            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        test('should not navigate when clicking on project content', () => {
            renderWithProviders(<ProjectDetailsPage/>);
            const projectContainer = screen.getByTestId('project-content');

            fireEvent.click(projectContainer, {
                bubbles: false
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });

        test('should handle navigation to edit page', () => {
            render(<ProjectDetailsPage/>);
            const editButton = screen.getByText('projectDetails.edit');
            fireEvent.click(editButton);
            expect(mockNavigate).toHaveBeenCalledWith('/edit-project/1');
        });
    });

    describe('Project Operations', () => {
        describe('Project Deletion', () => {
            test('should handle project deletion with confirmation', async () => {
                window.confirm = vi.fn(() => true);
                render(<ProjectDetailsPage/>);

                const deleteButton = screen.getByText('projectDetails.delete');
                fireEvent.click(deleteButton);

                expect(window.confirm).toHaveBeenCalledWith('projectDetails.confirmDelete');
                expect(mockDeleteProject).toHaveBeenCalledWith(1);
                await waitFor(() => {
                    expect(mockNavigate).toHaveBeenCalledWith('/', {replace: true});
                });
            });

            test('should handle project deletion cancellation', () => {
                window.confirm = vi.fn(() => false);
                render(<ProjectDetailsPage/>);

                const deleteButton = screen.getByText('projectDetails.delete');
                fireEvent.click(deleteButton);

                expect(window.confirm).toHaveBeenCalled();
                expect(mockDeleteProject).not.toHaveBeenCalled();
            });

            test('should handle unauthorized project deletion', async () => {
                window.confirm = vi.fn(() => true);
                mockDeleteProject.mockRejectedValueOnce(new ApiError(403, 'Forbidden', 'FORBIDDEN'));

                render(<ProjectDetailsPage/>);
                const deleteButton = screen.getByText('projectDetails.delete');
                fireEvent.click(deleteButton);

                await waitFor(() => {
                    expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
                });
            });
        });

        test('should handle image deletion with confirmation', async () => {
            window.confirm = vi.fn(() => true);
            render(<ProjectDetailsPage/>);

            const deleteImageButton = screen.getByTestId('delete-image-1');
            fireEvent.click(deleteImageButton);

            expect(window.confirm).toHaveBeenCalledWith('projectDetails.confirmImageDelete');
            expect(mockDeleteProjectImage).toHaveBeenCalledWith(1, 1);
        });
    });
});