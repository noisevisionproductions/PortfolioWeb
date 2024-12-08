import {render, screen, fireEvent} from "@testing-library/react";
import {vi} from "vitest";
import {Project, ProjectStatus} from "@/projects/types/project";
import {FeaturesList} from "@/projects/components/projectCreate/FeaturesList";

vi.mock('@/components/shared/FormInput', () => ({
    FormInput: ({label, value, onChange, id}: any) => (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={id}
            />
        </div>
    )
}));

describe('FeaturesList', () => {
    const mockProject: Project = {
        name: 'Test Project',
        slug: 'test-project',
        description: 'Test Description',
        status: ProjectStatus.IN_PROGRESS,
        technologies: [],
        features: ['Feature 1', 'Feature 2'],
        contributors: [],
        projectImages: []
    };

    const mockT = (key: string) => key;
    const mockOnProjectChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render initial features', () => {
        render(
            <FeaturesList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        expect(screen.getByTestId('feature-0')).toHaveValue('Feature 1');
        expect(screen.getByTestId('feature-1')).toHaveValue('Feature 2');
    });

    test('should add new empty feature when clicking add button', () => {
        render(
            <FeaturesList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        const addButton = screen.getByText('projectForm.addFeature');
        fireEvent.click(addButton);

        expect(mockOnProjectChange).toHaveBeenCalledWith({
            ...mockProject,
            features: [...mockProject.features, '']
        });
    });

    test('should remove feature when clicking remove button', () => {
        render(
            <FeaturesList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        const removeButtons = screen.getAllByText('common.remove');
        fireEvent.click(removeButtons[0]);

        expect(mockOnProjectChange).toHaveBeenCalledWith({
            ...mockProject,
            features: ['Feature 2']
        });
    });

    test('should update feature text correctly', () => {
        render(
            <FeaturesList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        const featureInput = screen.getByTestId('feature-0');
        fireEvent.change(featureInput, {target: {value: 'Updated Feature'}});

        expect(mockOnProjectChange).toHaveBeenCalledWith({
            ...mockProject,
            features: ['Updated Feature', 'Feature 2']
        });
    });

    test('should handle empty features array', () => {
        const projectWithNoFeatures = {
            ...mockProject,
            features: []
        };

        render(
            <FeaturesList
                project={projectWithNoFeatures}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        expect(screen.queryByTestId(/feature-\d+/)).not.toBeInTheDocument();
        expect(screen.getByText('projectForm.addFeature')).toBeInTheDocument();
    });

    test('should display correct number of features and remove buttons', () => {
        render(
            <FeaturesList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        const featureInputs = screen.getAllByTestId(/feature-\d+/);
        const removeButtons = screen.getAllByText('common.remove');

        expect(featureInputs).toHaveLength(2);
        expect(removeButtons).toHaveLength(2);
    });
});