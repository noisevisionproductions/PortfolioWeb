import {vi} from "vitest";
import {featureService} from "@/projects/services";
import {Project, ProjectStatus} from "@/projects/types/project";
import {ProjectFeatureContext, ProjectFeatureProvider} from "@/projects/context/ProjectFeatureContext";
import React, {useContext} from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import {setupCommonMocks, mockConsoleError} from '@/tests/unit/__mocks__/commonMocks';
import {BaseProjectProvider} from "@/projects/context/BaseProjectContext";

setupCommonMocks();
mockConsoleError();

vi.mock('@/projects/services', () => ({
    featureService: {
        updateFeatures: vi.fn(),
    }
}));

const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    slug: 'test-project',
    description: 'Test Description',
    status: ProjectStatus.IN_PROGRESS,
    technologies: ['React', 'TypeScript'],
    features: ['Feature 1', 'Feature 2'],
    contributors: [],
    projectImages: [],
};

const mockFeatures = ['New Feature 1', 'New Feature 2'];

const TestComponent = () => {
    const context = useContext(ProjectFeatureContext);
    if (!context) throw new Error('Context not provided');

    return (
        <div>
            <button onClick={() => context?.updateFeatures(1, mockFeatures)}>
                Update Features
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
            <ProjectFeatureProvider>
                {component}
            </ProjectFeatureProvider>
        </BaseProjectProvider>
    );
};

describe('ProjectFeatureProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render provider without crashing', () => {
        renderWithProviders(<TestComponent/>);
        expect(screen.getByText('Update Features')).toBeInTheDocument();
    });

    test('should show loading state when updating features', async () => {
        vi.mocked(featureService.updateFeatures).mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        renderWithProviders(<TestComponent/>);

        const button = screen.getByText('Update Features');
        await act(async () => {
            button.click();
        });

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    test('should successfully update features', async () => {
        vi.mocked(featureService.updateFeatures).mockResolvedValueOnce(mockProject);

        renderWithProviders(<TestComponent/>);

        const button = screen.getByText('Update Features');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(featureService.updateFeatures).toHaveBeenCalledWith(1, mockFeatures);
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
    });

    test('should handle error when updating features fails', async () => {
        const error = new Error('Failed to update features');
        vi.mocked(featureService.updateFeatures).mockRejectedValueOnce(error);

        renderWithProviders(<TestComponent/>);

        const button = screen.getByText('Update Features');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('error-message'))
                .toHaveTextContent('errors.feature.update');
        });

        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        expect(console.error).toHaveBeenCalledWith(error);
    });
});