import {describe, test, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ProjectDetails} from "@/projects/components/projectDetails/ProjectDetails";
import {Project, ProjectStatus} from '@/projects/types/project';
import {vi} from "vitest";
import '@testing-library/jest-dom';

vi.mock('@/projects/components/projectDetails/ProjectStatusBadge', () => ({
    ProjectStatusBadge: ({status, t}: { status: ProjectStatus; t: (key: string) => string }) => (
        <div data-testid="status-badge">{t(`project.status.${status.toLowerCase()}`)}</div>
    )
}));

vi.mock('@/projects/components/projectDetails/ProjectDates', () => ({
    ProjectDatesDisplay: ({startDate, endDate}: {
        startDate?: Date;
        endDate?: Date;
        t: (key: string) => string
    }) => (
        <div data-testid="dates-display">
            {startDate && <span>{startDate.toISOString()}</span>}
            {endDate && <span>{endDate.toISOString()}</span>}
        </div>
    )
}));

const mockTranslation = (key: string) => key;

const mockProject: Project = {
    id: 1,
    name: "Test Project",
    slug: "test-project",
    description: "Test Description",
    repositoryUrl: "https://github.com/test/project",
    status: ProjectStatus.IN_PROGRESS,
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    features: ["Feature 1", "Feature 2"],
    technologies: ["React", "TypeScript"],
    contributors: [
        {
            name: "John Doe",
            role: "Developer",
            profileUrl: "https://github.com/johndoe"
        }
    ],
    projectImages: []
};

describe('ProjectDetails', () => {
    test('should render project name and status', () => {
        render(<ProjectDetails project={mockProject} t={mockTranslation}/>);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByTestId('status-badge')).toBeInTheDocument();
        expect(screen.getByTestId('status-badge'))
            .toHaveTextContent('project.status.in_progress');
    });

    test('should render repository link when url is provided', () => {
        render(
            <ProjectDetails
                project={mockProject}
                t={mockTranslation}
            />
        );

        const repoLink = screen.getByText('projectDetails.viewRepository');
        expect(repoLink).toBeInTheDocument();
        expect(repoLink.closest('a')).toHaveAttribute('href', mockProject.repositoryUrl);
    });

    test('should not render repository link when url is not provided', () => {
        const projectWithoutRepo = {...mockProject, repositoryUrl: undefined};
        render(
            <ProjectDetails
                project={projectWithoutRepo}
                t={mockTranslation}
            />
        );

        expect(screen.queryByText('projectDetails.viewRepository')).not.toBeInTheDocument();
    });

    test('should render all features', () => {
        render(
            <ProjectDetails
                project={mockProject}
                t={mockTranslation}
            />
        );

        mockProject.features.forEach(feature => {
            expect(screen.getByText(feature)).toBeInTheDocument();
        });
    });

    test('should render contributor information', () => {
        render(
            <ProjectDetails
                project={mockProject}
                t={mockTranslation}
            />
        );

        const contributor = mockProject.contributors[0];
        expect(screen.getByText(contributor.name)).toBeInTheDocument();
        expect(screen.getByText(contributor.role)).toBeInTheDocument();
        expect(screen.getByText('projectDetails.viewProfile')).toHaveAttribute('href', contributor.profileUrl);
    });

    test('should not render contributors section when no features', () => {
        const projectWithoutFeatures = {...mockProject, features: []};
        render(
            <ProjectDetails
                project={projectWithoutFeatures}
                t={mockTranslation}
            />
        );

        expect(screen.queryByText('projectDetails.features')).not.toBeInTheDocument();
    });

    test('should render dates correctly', () => {
        render(
            <ProjectDetails
                project={mockProject}
                t={mockTranslation}
            />
        );

        const datesDisplay = screen.getByTestId('dates-display');
        expect(datesDisplay).toBeInTheDocument();
        expect(datesDisplay).toHaveTextContent(mockProject.startDate!.toISOString());
        expect(datesDisplay).toHaveTextContent(mockProject.endDate!.toISOString());

    });
});