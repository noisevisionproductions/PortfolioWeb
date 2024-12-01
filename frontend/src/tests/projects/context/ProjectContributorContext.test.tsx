import {vi} from "vitest";
import {contributorService} from "@/projects/services";
import {Contributor, Project, ProjectStatus} from "@/projects/types/project";
import {ProjectContributorContext, ProjectContributorProvider} from "@/projects/context/ProjectContributorContext";
import React, {useContext} from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import {mockConsoleError, setupCommonMocks} from "@/tests/__mocks__/commonMocks";
import {BaseProjectProvider} from "@/projects/context/BaseProjectContext";

setupCommonMocks();
mockConsoleError();

vi.mock('@/projects/services', () => ({
    contributorService: {
        addContributor: vi.fn(),
    }
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
    projectImages: [],
};

const mockContributor: Contributor = {
    name: 'John Doe',
    role: 'Developer',
    profileUrl: 'https://github.com/johndoe'
};

const TestComponent = () => {
    const context = useContext(ProjectContributorContext);
    if (!context) throw new Error('Context not provided');

    return (
        <div>
            <button onClick={() => context?.addContributor(1, mockContributor)}>
                Add Contributor
            </button>
            {context.loading && <div data-testid='loading'>
                Loading...
            </div>}
            {context.error && <div data-testid="error-message">{context.error}</div>}
        </div>
    );
};

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BaseProjectProvider>
            <ProjectContributorProvider>
                {component}
            </ProjectContributorProvider>
        </BaseProjectProvider>
    );
};

describe('ProjectContributorProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render provider without crashing', () => {
        renderWithProviders(<TestComponent/>);
        expect(screen.getByText('Add Contributor')).toBeInTheDocument();
    });

    test('should show loading state when adding contributor', async () => {
        vi.mocked(contributorService.addContributor).mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        renderWithProviders(<TestComponent/>);

        const button = screen.getByText('Add Contributor');
        await act(async () => {
            button.click();
        });

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    test('should successfully add contributor', async () => {
        vi.mocked(contributorService.addContributor).mockResolvedValueOnce(mockProject);

        renderWithProviders(<TestComponent/>);

        const button = screen.getByText('Add Contributor');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(contributorService.addContributor).toHaveBeenCalledWith(1, mockContributor);
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
    });

    test('should handle error when adding contributor fails', async () => {
        const error = new Error('Failed to add contributor');
        vi.mocked(contributorService.addContributor).mockRejectedValueOnce(error);

        renderWithProviders(<TestComponent/>);

        const button = screen.getByText('Add Contributor');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('error-message'))
                .toHaveTextContent('errors.contributor.add');
        });

        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        expect(console.error).toHaveBeenCalledWith(error);
    });
});