import {beforeEach, describe, test, vi} from "vitest";
import {ProjectStatus} from "@/projects/types/project";
import {render, waitFor, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import ProjectFormPage from "@/projects/components/projectCreate/ProjectFormPage";
import userEvent from "@testing-library/user-event";
import React from "react";
import {BaseProjectProvider} from "@/projects/context/BaseProjectContext";
import {ProjectImageProvider} from "@/projects/context/ProjectImageContext";
import {ProjectContributorProvider} from "@/projects/context/ProjectContributorContext";
import {ProjectFeatureProvider} from "@/projects/context/ProjectFeatureContext";
import {AuthProvider} from "@/auth/context/BaseAuthContext";

const mockCreateProject = vi.fn();

vi.mock('@/auth/hooks/useBaseAuthContext', () => ({
    useBaseAuthContext: () => ({
        user: {
            email: 'test@example.com',
            role: 'ADMIN',
            authorities: ['ROLE_ADMIN']
        },
        loading: false,
        error: null,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        hasAuthority: () => true
    })
}));

vi.mock('@/projects/context', () => ({
    useBaseProject: () => ({
        loading: false,
        error: null,
        selectedProject: null,
        getProject: vi.fn(),
        createProject: vi.fn(),
        updateProject: vi.fn()
    }),
    useProjectImage: () => ({
        loading: false,
        error: null,
        uploadProjectImage: vi.fn()
    }),
    useProjectContributor: () => ({
        loading: false,
        error: null,
        addContributor: vi.fn()
    }),
    useProjectFeature: () => ({
        loading: false,
        error: null,
        updateFeatures: vi.fn()
    })
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

const TestWrapper = ({children}: { children: React.ReactNode }) => {
    return (
        <MemoryRouter>
            <AuthProvider>
                <BaseProjectProvider>
                    <ProjectImageProvider>
                        <ProjectContributorProvider>
                            <ProjectFeatureProvider>
                                {children}
                            </ProjectFeatureProvider>
                        </ProjectContributorProvider>
                    </ProjectImageProvider>
                </BaseProjectProvider>
            </AuthProvider>
        </MemoryRouter>
    );
};


describe('Project Creation Integration Test', () => {
    const mockFile = new File(['test image content'], 'test-image.png', {type: 'image/png'});
    const mockProject = {
        id: undefined,
        name: 'Test Integration Project',
        description: 'This is a test project description',
        status: ProjectStatus.IN_PROGRESS,
        slug: 'test-integration-project',
        repositoryUrl: 'https://github.com/test/project',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        features: ['Feature 1', 'Feature 2'],
        technologies: ['React', 'TypeScript', 'Spring Boot'],
        contributors: [
            {
                name: 'John Doe',
                role: 'Developer',
                profileUrl: 'https://github.com/johndoe'
            }
        ],
        projectImages: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should create project with all data including images', async () => {
        render(
            <TestWrapper>
                <ProjectFormPage/>
            </TestWrapper>
        );

        await userEvent.type(screen.getByLabelText(/name/i), mockProject.name);
        await userEvent.type(screen.getByLabelText(/description/i), mockProject.description);
        await userEvent.type(screen.getByLabelText(/repository url/i), mockProject.repositoryUrl || '');

        const statusSelect = screen.getByLabelText(/label/i);
        await userEvent.selectOptions(statusSelect, mockProject.status);

        await userEvent.type(
            screen.getByLabelText(/start date/i),
            mockProject.startDate.toISOString().split('T')[0]
        );
        await userEvent.type(
            screen.getByLabelText(/end date/i),
            mockProject.endDate.toISOString().split('T')[0]
        );

        const techInput = screen.getByLabelText(/add techonology/i);
        for (const tech of mockProject.technologies) {
            await userEvent.type(techInput, tech);
            await userEvent.click(screen.getByText(/add technology/i));
        }

        const featureInput = screen.getByLabelText(/add feature/i);
        for (const feature of mockProject.features) {
            await userEvent.type(featureInput, feature);
            await userEvent.click(screen.getByText(/add feature/i));
        }

        await userEvent.click(screen.getByText(/add contributor/i));
        await userEvent.type(screen.getByLabelText(/contributor name/i), mockProject.contributors[0].name);
        await userEvent.type(screen.getByLabelText(/contributor role/i), mockProject.contributors[0].role);
        await userEvent.type(screen.getByLabelText(/profile url/i), mockProject.contributors[0].profileUrl);
        await userEvent.click(screen.getByText(/save contributor/i));

        const fileInput = screen.getByLabelText(/upload image/i);
        await userEvent.upload(fileInput, mockFile);

        await userEvent.type(screen.getByLabelText(/image caption/i), 'Test Image');

        await userEvent.click(screen.getByText(/save project/i));

        await waitFor(() => {
            expect(mockCreateProject).toHaveBeenCalledWith({
                ...mockProject,
                file: mockFile,
                imageCaption: 'Test Image'
            });
        });

        await waitFor(() => {
            expect(screen.getByText(/project created successfully/i)).toBeInTheDocument();
        });

        expect(screen.getByText(mockProject.name)).toBeInTheDocument();
        expect(screen.getByText(mockProject.description)).toBeInTheDocument();
        expect(screen.getByText(mockProject.technologies[0])).toBeInTheDocument();
        expect(screen.getByText(mockProject.features[0])).toBeInTheDocument();
        expect(screen.getByText(mockProject.contributors[0].name)).toBeInTheDocument();
        expect(screen.getByAltText('Test Image')).toHaveAttribute('src', '/api/files/test-image-123.png');
    });
});