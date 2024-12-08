import {vi} from "vitest";
import {Project, ProjectStatus} from "@/projects/types/project";
import {fireEvent, render, screen} from "@testing-library/react";
import {ContributorsList} from "@/projects/components/projectCreate/ContributorsList";

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

describe('ContributorsList', () => {
    const mockProject: Project = {
        name: 'Test Project',
        slug: 'test-project',
        description: 'Test Description',
        status: ProjectStatus.IN_PROGRESS,
        technologies: [],
        features: [],
        contributors: [
            {
                name: 'John Doe',
                role: 'Developer',
                profileUrl: 'https://github.com/johndoe'
            }
        ],
        projectImages: []
    };

    const mockT = (key: string) => key;
    const mockOnProjectChange = vi.fn();

    beforeEach(() => {
        mockOnProjectChange.mockClear();
    });

    test('should render initial contributor', () => {
        render(
            <ContributorsList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        expect(screen.getByTestId('contributor-0-name')).toHaveValue('John Doe');
        expect(screen.getByTestId('contributor-0-role')).toHaveValue('Developer');
        expect(screen.getByTestId('contributor-0-profileUrl')).toHaveValue('https://github.com/johndoe')
    });

    test('should add new contributor when clicking add button', () => {
        render(
            <ContributorsList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        const addButton = screen.getByText('projectForm.addContributor');
        fireEvent.click(addButton);

        expect(mockOnProjectChange).toHaveBeenCalledWith({
            ...mockProject,
            contributors: [
                ...mockProject.contributors,
                {name: '', role: '', profileUrl: ''}
            ]
        });
    });

    test('should remove contributor when clicking remove button', () => {
        render(
            <ContributorsList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        const removeButton = screen.getByText('common.remove');
        fireEvent.click(removeButton);

        expect(mockOnProjectChange).toHaveBeenCalledWith({
            ...mockProject,
            contributors: []
        });
    });

    test('should update contributor fields correctly', () => {
        render(
            <ContributorsList
                project={mockProject}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        const nameInput = screen.getByTestId('contributor-0-name');
        fireEvent.change(nameInput, {target: {value: 'Jane Doe'}});

        expect(mockOnProjectChange).toHaveBeenCalledWith({
            ...mockProject,
            contributors: [
                {
                    ...mockProject.contributors[0],
                    name: 'Jane Doe'
                }
            ]
        });
    });

    test('should display correct number of contributors', () => {
        const projectWithMultipleContributors = {
            ...mockProject,
            contributors: [
                {name: 'John Doe', role: 'Developer', profileUrl: 'https://github.com/johndoe'},
                {name: 'Jane Smith', role: 'Designer', profileUrl: 'https://github.com/janesmith'}
            ]
        };

        render(
            <ContributorsList
                project={projectWithMultipleContributors}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        expect(screen.getAllByText(/projectForm.contributor #\d+/)).toHaveLength(2);
        expect(screen.getAllByText('common.remove')).toHaveLength(2);
    });

    test('should handle empty contributors array', () => {
        const projectWithNoContributors = {
            ...mockProject,
            contributors: []
        };

        render(
            <ContributorsList
                project={projectWithNoContributors}
                onProjectChange={mockOnProjectChange}
                t={mockT}
            />
        );

        expect(screen.queryByText(/projectForm.contributor #/)).not.toBeInTheDocument();
        expect(screen.queryByText('common.remove')).not.toBeInTheDocument();
        expect(screen.getByText('projectForm.addContributor')).toBeInTheDocument();
    });
});