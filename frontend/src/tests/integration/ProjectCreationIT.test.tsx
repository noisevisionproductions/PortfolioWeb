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

const TEST_IMAGE = 'Test Image';
const TEST_TIMEOUT = 30000;
const STEP_TIMEOUT = 5000;

const mockCreateProjectPromise = vi.fn().mockImplementation(() => Promise.resolve(mockSavedProject));
const mockUploadImagePromise = vi.fn().mockImplementation(() => Promise.resolve(undefined));
const mockAddContributorPromise = vi.fn().mockImplementation(() => Promise.resolve(undefined));
const mockUpdateFeaturesPromise = vi.fn().mockImplementation(() => Promise.resolve(undefined));
const mockNavigate = vi.fn();

const mockObjectUrl = "mock-object-url";
const technology = "Spring Boot";
global.URL.createObjectURL = vi.fn(() => mockObjectUrl);

const mockSavedProject = {
    id: 1,
    name: 'Test Integration Project',
    description: 'This is a test project description',
    status: ProjectStatus.IN_PROGRESS,
    slug: 'test-integration-project',
    repositoryUrl: 'https://github.com/test/project',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Feature 1', 'Feature 2'],
    technologies: ['React', 'TypeScript', technology],
    contributors: [
        {
            name: 'John Doe',
            role: 'Developer',
            profileUrl: 'https://github.com/johndoe'
        }
    ],
    projectImages: [
        {
            id: 1,
            imageUrl: '/api/files/test-image-123.png',
            caption: TEST_IMAGE
        }
    ]
};

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
        createProject: mockCreateProjectPromise,
        updateProject: vi.fn(),
    }),
    useProjectImage: () => ({
        loading: false,
        error: null,
        uploadProjectImage: mockUploadImagePromise
    }),
    useProjectContributor: () => ({
        loading: false,
        error: null,
        addContributor: mockAddContributorPromise
    }),
    useProjectFeature: () => ({
        loading: false,
        error: null,
        updateFeatures: mockUpdateFeaturesPromise
    })
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (str: string) => str
    })
}));

vi.mock('@/assets/programmingLanguages.json', () => ({
    default: {
        languages: ['React', 'TypeScript', technology, 'JavaScript', 'Java'],
        other: {
            pl: ['Next.js', 'Node.js'],
            en: ['Next.js', 'Node.js']
        }
    }
}));

const TestWrapper = ({children}: { children: React.ReactNode }) => (
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

describe('Project Creation Integration Test', () => {
    const mockFile = new File(['test image content'], 'test-image.png', {type: 'image/png'});
    const mockProject = {
        name: 'Test Integration Project',
        description: 'This is a test project description',
        status: ProjectStatus.IN_PROGRESS,
        repositoryUrl: 'https://github.com/test/project',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        features: ['Feature 1', 'Feature 2'],
        technologies: ['React', 'TypeScript', technology],
        contributors: [
            {
                name: 'John Doe',
                role: 'Developer',
                profileUrl: 'https://github.com/johndoe'
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();

        mockCreateProjectPromise.mockClear().mockImplementation(() => Promise.resolve(mockSavedProject));
        mockUploadImagePromise.mockClear().mockImplementation(() => Promise.resolve(undefined));
        mockAddContributorPromise.mockClear().mockImplementation(() => Promise.resolve(undefined));
        mockUpdateFeaturesPromise.mockClear().mockImplementation(() => Promise.resolve(undefined));
        mockNavigate.mockClear();

        vi.mocked(global.URL.createObjectURL).mockReset();
        vi.mocked(global.URL.createObjectURL).mockImplementation(() => mockObjectUrl);

        vi.clearAllTimers();
    });

    test('should create project with all data including images', async () => {
        const user = userEvent.setup({delay: null});

        render(
            <TestWrapper>
                <ProjectFormPage/>
            </TestWrapper>
        );

        try {
            await waitFor(() => {
                const nameInput = screen.getByLabelText(/name/i);
                expect(nameInput).toBeInTheDocument();
            }, {timeout: STEP_TIMEOUT});

            await user.type(screen.getByLabelText(/name/i), mockProject.name);
            await user.type(screen.getByLabelText(/description/i), mockProject.description);
            await user.type(screen.getByLabelText(/repositoryUrl/i), mockProject.repositoryUrl || '');

            const statusSelect = screen.getByLabelText(/projectForm.status/i);
            await user.selectOptions(statusSelect, mockProject.status);

            await user.type(
                screen.getByLabelText('projectForm.startDate'),
                mockProject.startDate.toISOString().split('T')[0]
            );
            await user.type(
                screen.getByLabelText('projectForm.endDate'),
                mockProject.endDate.toISOString().split('T')[0]
            );

            for (const tech of mockProject.technologies) {
                const techButton = screen.getByRole('button', {name: tech});
                await user.click(techButton);
            }

            for (const feature of mockProject.features) {
                const addFeatureButton = screen.getByRole('button', {name: /projectForm.addFeature/i});
                await user.click(addFeatureButton);
                const inputs = screen.getAllByRole('textbox');
                const lastInput = inputs[inputs.length - 1];
                await user.type(lastInput, feature);
            }

            const addContributorButton = screen.getByRole('button', {name: /projectForm.addContributor/i});
            await user.click(addContributorButton);

            const contributorData = mockProject.contributors[0];
            await user.type(screen.getByRole('textbox', {name: /projectForm.contributorName/i}), contributorData.name);
            await user.type(screen.getByRole('textbox', {name: /projectForm.contributorRole/i}), contributorData.role);
            await user.type(screen.getByRole('textbox', {name: /projectForm.contributorProfileUrl/i}), contributorData.profileUrl);

            const addImageButton = screen.getByRole('button', {name: /projectForm.addImage/i});
            await user.click(addImageButton);

            await user.upload(screen.getByTestId('file-input'), mockFile);
            await user.type(await screen.findByRole('textbox', {name: /projectForm.caption/i}), TEST_IMAGE);
            await user.click(screen.getByRole('button', {name: /projectForm.saveImage/i}));

            await user.click(screen.getByRole('button', {name: /projectForm.saveProject/i}));

            await waitFor(() => {
                expect(screen.getByText(/projectForm.successTitle/i)).toBeInTheDocument();
            }, {timeout: STEP_TIMEOUT});

            await user.click(screen.getByText(/common.continue/i));
            expect(mockNavigate).toHaveBeenCalledWith('/');

        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    }, TEST_TIMEOUT);
});